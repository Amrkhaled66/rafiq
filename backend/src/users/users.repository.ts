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
import { users } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';
import { ListUsersQueryDto } from './dto/list-users-query.dto';

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

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

  async list(query: ListUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const whereClause = this.buildListWhereClause(query);

    const items = await this.database
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await this.database
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);

    return {
      items,
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

  private buildListWhereClause(query: ListUsersQueryDto): SQL | undefined {
    const conditions: SQL[] = [];

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
