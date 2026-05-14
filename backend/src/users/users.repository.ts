import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  desc,
  eq,
  ilike,
  isNotNull,
  isNull,
  ne,
  sql,
} from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { coachAssignments, users } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import { ListUsersQueryDto } from './dto/list-users-query.dto';

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type UserListRow = UserRow & { assignedStudentsCount: number };
export type ListUsersScope =
  | { type: 'all' }
  | { coachId: number; type: 'assigned_students' };

@Injectable()
export class UsersRepository {
  constructor(@Inject(db) private readonly database: Database) {}

  findById(id: number): Promise<UserRow | undefined> {
    return this.database.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  findActiveById(id: number): Promise<UserRow | undefined> {
    return this.database.query.users.findFirst({
      where: and(eq(users.id, id), isNull(users.deletedAt)),
    });
  }

  findActiveByPhone(phone: string): Promise<UserRow | undefined> {
    return this.database.query.users.findFirst({
      where: and(eq(users.phone, phone), isNull(users.deletedAt)),
    });
  }

  findByPhoneExcludingUser(
    phone: string,
    excludedUserId?: number,
  ): Promise<UserRow | undefined> {
    const conditions: SQL[] = [eq(users.phone, phone)];

    if (excludedUserId !== undefined) {
      conditions.push(ne(users.id, excludedUserId));
    }

    return this.database.query.users.findFirst({
      where: and(...conditions),
    });
  }

  async list(query: ListUsersQueryDto, scope: ListUsersScope) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const whereClause = this.buildListWhereClause(query, scope);
    const items =
      scope.type === 'assigned_students'
        ? await this.database
            .select({
              id: users.id,
              fullName: users.fullName,
              phone: users.phone,
              password: users.password,
              role: users.role,
              createdAt: users.createdAt,
              updatedAt: users.updatedAt,
              deletedAt: users.deletedAt,
              assignedStudentsCount: sql<number>`0`,
            })
            .from(users)
            .innerJoin(
              coachAssignments,
              eq(users.id, coachAssignments.studentId),
            )
            .where(whereClause)
            .orderBy(desc(users.createdAt))
            .limit(limit)
            .offset(offset)
        : await this.database
            .select({
              id: users.id,
              fullName: users.fullName,
              phone: users.phone,
              password: users.password,
              role: users.role,
              createdAt: users.createdAt,
              updatedAt: users.updatedAt,
              deletedAt: users.deletedAt,
              assignedStudentsCount:
                sql<number>`count(${coachAssignments.studentId})`,
            })
            .from(users)
            .leftJoin(
              coachAssignments,
              eq(users.id, coachAssignments.coachId),
            )
            .where(whereClause)
            .groupBy(
              users.id,
              users.fullName,
              users.phone,
              users.password,
              users.role,
              users.createdAt,
              users.updatedAt,
              users.deletedAt,
            )
            .orderBy(desc(users.createdAt))
            .limit(limit)
            .offset(offset);

    const countQuery = this.database
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    if (scope.type === 'assigned_students') {
      countQuery.innerJoin(
        coachAssignments,
        eq(users.id, coachAssignments.studentId),
      );
    }

    const [{ count }] = await countQuery;

    return {
      items: items as UserListRow[],
      page,
      limit,
      total: Number(count),
    };
  }

  async create(values: UserInsert): Promise<UserRow> {
    const [createdUser] = await this.database.insert(users).values(values).returning();
    return createdUser;
  }

  async updateById(id: number, values: Partial<UserInsert>): Promise<UserRow> {
    const [updatedUser] = await this.database
      .update(users)
      .set(values)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }

  async softDeleteById(id: number): Promise<void> {
    await this.database
      .update(users)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  private buildListWhereClause(
    query: ListUsersQueryDto,
    scope: ListUsersScope,
  ): SQL | undefined {
    const conditions: SQL[] = [];

    if (scope.type === 'assigned_students') {
      conditions.push(eq(coachAssignments.coachId, scope.coachId));
      conditions.push(eq(users.role, 'student'));
    }

    if (query.role) {
      conditions.push(eq(users.role, query.role));
    }

    if (query.phone) {
      conditions.push(ilike(users.phone, `%${query.phone.trim()}%`));
    }

    if (query.deletedStatus === 'active') {
      conditions.push(isNull(users.deletedAt));
    } else if (query.deletedStatus === 'deleted') {
      conditions.push(isNotNull(users.deletedAt));
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }
}
