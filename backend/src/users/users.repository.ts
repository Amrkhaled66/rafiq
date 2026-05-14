import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull, ne } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { users } from '../db';
import { db } from '../db/db.module';
import type { Database } from '../db/db.module';

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
}
