import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  isNull,
  lte,
  gte,
  sql,
} from 'drizzle-orm';
import { subscriptionPackages, subscriptions, users } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';

type SubscriptionRow = typeof subscriptions.$inferSelect;
type PackageRow = typeof subscriptionPackages.$inferSelect;

export type SubscriptionListRow = {
  id: number;
  studentId: number;
  studentName: string;
  packageId: number;
  packageName: string;
  startsAt: string;
  endsAt: string;
  status: 'active' | 'upcoming' | 'ended' | 'cancelled';
};

export type StudentSubscriptionRow = {
  id: number;
  studentId: number;
  packageId: number;
  packageName: string;
  startsAt: string;
  endsAt: string;
  amountPaid: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'upcoming' | 'ended';
};

@Injectable()
export class SubscriptionsRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  async listPackages(): Promise<PackageRow[]> {
    return this.database.query.subscriptionPackages.findMany({
      orderBy: [desc(subscriptionPackages.createdAt)],
    });
  }

  async createPackage(input: {
    name: string;
    durationDays: number;
    price: number;
  }): Promise<PackageRow> {
    const [created] = await this.database
      .insert(subscriptionPackages)
      .values(input)
      .returning();

    return created;
  }

  async findPackageById(id: number): Promise<PackageRow | undefined> {
    return this.database.query.subscriptionPackages.findFirst({
      where: eq(subscriptionPackages.id, id),
    });
  }

  async createSubscription(input: {
    studentId: number;
    packageId: number;
    startsAt: string;
    endsAt: string;
    amountPaid: number;
    createdBy: number;
  }): Promise<SubscriptionRow> {
    const [created] = await this.database
      .insert(subscriptions)
      .values(input)
      .returning();

    return created;
  }

  async hasOverlappingSubscription(
    studentId: number,
    startsOn: string,
    endsOn: string,
  ): Promise<boolean> {
    const [record] = await this.database
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.studentId, studentId),
          isNull(subscriptions.cancelledAt),
          lte(subscriptions.startsAt, startsOn),
          gte(subscriptions.endsAt, startsOn),
        ),
      )
      .limit(1);

    if (record) {
      return true;
    }

    const [intersects] = await this.database
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.studentId, studentId),
          isNull(subscriptions.cancelledAt),
          lte(subscriptions.startsAt, endsOn),
          gte(subscriptions.endsAt, startsOn),
        ),
      )
      .limit(1);

    return Boolean(intersects);
  }

  async listSubscriptions(input: {
    page: number;
    limit: number;
    endingSoon?: boolean;
  }) {
    const offset = (input.page - 1) * input.limit;
    const endingSoonCondition = input.endingSoon
      ? and(
          isNull(subscriptions.cancelledAt),
          lte(subscriptions.startsAt, sql`current_date`),
          gte(subscriptions.endsAt, sql`current_date`),
          lte(subscriptions.endsAt, sql`current_date + interval '7 days'`),
        )
      : undefined;

    const items = await this.database
      .select({
        id: subscriptions.id,
        studentId: subscriptions.studentId,
        studentName: users.fullName,
        packageId: subscriptions.packageId,
        packageName: subscriptionPackages.name,
        startsAt: subscriptions.startsAt,
        endsAt: subscriptions.endsAt,
        status: sql<'active' | 'upcoming' | 'ended' | 'cancelled'>`
          case
            when ${subscriptions.cancelledAt} is not null then 'cancelled'
            when current_date < ${subscriptions.startsAt} then 'upcoming'
            when current_date > ${subscriptions.endsAt} then 'ended'
            else 'active'
          end
        `,
      })
      .from(subscriptions)
      .innerJoin(users, eq(subscriptions.studentId, users.id))
      .innerJoin(
        subscriptionPackages,
        eq(subscriptions.packageId, subscriptionPackages.id),
      )
      .where(endingSoonCondition)
      .orderBy(desc(subscriptions.createdAt))
      .limit(input.limit)
      .offset(offset);

    const [{ total }] = await this.database
      .select({ total: count() })
      .from(subscriptions)
      .where(endingSoonCondition);

    return {
      items: items as SubscriptionListRow[],
      page: input.page,
      limit: input.limit,
      total: Number(total ?? 0),
    };
  }

  async listStudentSubscriptions(
    studentId: number,
  ): Promise<StudentSubscriptionRow[]> {
    const rows = await this.database
      .select({
        id: subscriptions.id,
        studentId: subscriptions.studentId,
        packageId: subscriptions.packageId,
        packageName: subscriptionPackages.name,
        startsAt: subscriptions.startsAt,
        endsAt: subscriptions.endsAt,
        amountPaid: subscriptions.amountPaid,
        createdAt: subscriptions.createdAt,
        updatedAt: subscriptions.updatedAt,
        status: sql<'active' | 'upcoming' | 'ended'>`
          case
            when current_date < ${subscriptions.startsAt} then 'upcoming'
            when current_date > ${subscriptions.endsAt} then 'ended'
            else 'active'
          end
        `,
      })
      .from(subscriptions)
      .innerJoin(
        subscriptionPackages,
        eq(subscriptions.packageId, subscriptionPackages.id),
      )
      .where(
        and(
          eq(subscriptions.studentId, studentId),
          isNull(subscriptions.cancelledAt),
        ),
      );

    const statusPriority = {
      active: 0,
      upcoming: 1,
      ended: 2,
    } as const;

    return (rows as StudentSubscriptionRow[]).sort((left, right) => {
      if (statusPriority[left.status] !== statusPriority[right.status]) {
        return statusPriority[left.status] - statusPriority[right.status];
      }

      return right.startsAt.localeCompare(left.startsAt);
    });
  }

  async getSubscriptionStats() {
    const [stats] = await this.database
      .select({
        totalCount: count(subscriptions.id),
        activeSubscriptions:
          sql<number>`count(${subscriptions.id}) filter (where ${subscriptions.cancelledAt} is null and current_date >= ${subscriptions.startsAt} and current_date <= ${subscriptions.endsAt})`,
        soonEndingSubscriptions:
          sql<number>`count(${subscriptions.id}) filter (where ${subscriptions.cancelledAt} is null and ${subscriptions.startsAt} <= current_date and current_date <= ${subscriptions.endsAt} and ${subscriptions.endsAt} <= current_date + interval '7 days')`,
        endedSubscriptions:
          sql<number>`count(${subscriptions.id}) filter (where ${subscriptions.cancelledAt} is null and current_date > ${subscriptions.endsAt})`,
      })
      .from(subscriptions);

    return {
      totalCount: Number(stats?.totalCount ?? 0),
      activeSubscriptions: Number(stats?.activeSubscriptions ?? 0),
      soonEndingSubscriptions: Number(stats?.soonEndingSubscriptions ?? 0),
      endedSubscriptions: Number(stats?.endedSubscriptions ?? 0),
    };
  }
}
