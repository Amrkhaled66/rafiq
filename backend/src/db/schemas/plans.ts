import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { users } from './users';

export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id')
    .notNull()
    .references(() => users.id),
  coachId: integer('coach_id')
    .notNull()
    .references(() => users.id),
  startsOn: date('starts_on').notNull(),
  endsOn: date('ends_on').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const plansRelations = relations(plans, ({ many, one }) => ({
  student: one(users, {
    fields: [plans.studentId],
    references: [users.id],
    relationName: 'plans_student',
  }),
  coach: one(users, {
    fields: [plans.coachId],
    references: [users.id],
    relationName: 'plans_coach',
  }),
  tasks: many(tasks),
}));
