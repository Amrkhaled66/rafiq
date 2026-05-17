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

  async listSubscriptions(page: number, limit: number) {
    const offset = (page - 1) * limit;

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
      .orderBy(desc(subscriptions.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await this.database
      .select({ total: count() })
      .from(subscriptions);

    return {
      items: items as SubscriptionListRow[],
      page,
      limit,
      total: Number(total ?? 0),
    };
  }

  async getSubscriptionStats() {
    const [stats] = await this.database
      .select({
        totalCount: count(subscriptions.id),
        activeSubscriptions:
          sql<number>`count(${subscriptions.id}) filter (where ${subscriptions.cancelledAt} is null and current_date >= ${subscriptions.startsAt} and current_date <= ${subscriptions.endsAt})`,
        soonEndingSubscriptions:
          sql<number>`count(${subscriptions.id}) filter (where ${subscriptions.cancelledAt} is null and current_date <= ${subscriptions.endsAt} and ${subscriptions.endsAt} <= current_date + interval '7 days')`,
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
