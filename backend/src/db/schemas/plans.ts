import { relations } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { users } from './users';

export const plans = pgTable(
  'plans',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    studentId: integer('student_id')
      .notNull()
      .references(() => users.id),
    coachId: integer('coach_id')
      .notNull()
      .references(() => users.id),
    startsOn: date('starts_on').notNull(),
    endsOn: date('ends_on').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('plans_coach_created_at_idx').on(
      table.coachId,
      table.createdAt.desc(),
    ),
  ],
);

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
