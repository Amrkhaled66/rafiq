import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { schoolSubjectEnum, taskStatusEnum } from './enum';
import { plans } from './plans';
import { taskSessions } from './task-sessions';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  planId: integer('plan_id')
    .notNull()
    .references(() => plans.id),
  title: varchar('title', { length: 255 }).notNull(),
  subject: schoolSubjectEnum('subject').notNull(),
  dueAt: timestamp('due_at', { withTimezone: true }),
  status: taskStatusEnum('status').notNull().default('pending'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tasksRelations = relations(tasks, ({ many, one }) => ({
  plan: one(plans, {
    fields: [tasks.planId],
    references: [plans.id],
  }),
  taskSessions: many(taskSessions),
}));
