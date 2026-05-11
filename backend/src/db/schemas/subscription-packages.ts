import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { subscriptions } from './subscriptions';

export const subscriptionPackages = pgTable('subscription_packages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  durationDays: integer('duration_days').notNull(),
  price: integer('price').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const subscriptionPackagesRelations = relations(
  subscriptionPackages,
  ({ many }) => ({
    subscriptions: many(subscriptions),
  }),
);
