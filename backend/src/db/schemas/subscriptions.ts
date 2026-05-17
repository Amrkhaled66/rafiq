import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { subscriptionPackages } from './subscription-packages';
import { users } from './users';

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id')
    .notNull()
    .references(() => users.id),
  packageId: integer('package_id')
    .notNull()
    .references(() => subscriptionPackages.id),
  startsAt: date('starts_at').notNull(),
  endsAt: date('ends_at').notNull(),
  amountPaid: integer('amount_paid').notNull(),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  cancellationReason: text('cancellation_reason'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  student: one(users, {
    fields: [subscriptions.studentId],
    references: [users.id],
    relationName: 'subscriptions_student',
  }),
  package: one(subscriptionPackages, {
    fields: [subscriptions.packageId],
    references: [subscriptionPackages.id],
  }),
  creator: one(users, {
    fields: [subscriptions.createdBy],
    references: [users.id],
    relationName: 'subscriptions_creator',
  }),
}));
