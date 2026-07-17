import { relations } from 'drizzle-orm';
import { index, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { sessionStatusEnum } from './enum';
import { tasks } from './tasks';
import { users } from './users';

export const taskSessions = pgTable(
  'task_sessions',
  {
    id: serial('id').primaryKey(),
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    studentId: integer('student_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    expectedEndAt: timestamp('expected_end_at', { withTimezone: true }),
    accumulatedSeconds: integer('accumulated_seconds').notNull().default(0),
    lastStartedAt: timestamp('last_started_at', { withTimezone: true }),
    status: sessionStatusEnum('status').notNull().default('running'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('task_sessions_status_expected_end_at_idx').on(
      table.status,
      table.expectedEndAt,
    ),
  ],
);

export const taskSessionsRelations = relations(taskSessions, ({ one }) => ({
  task: one(tasks, {
    fields: [taskSessions.taskId],
    references: [tasks.id],
  }),
  student: one(users, {
    fields: [taskSessions.studentId],
    references: [users.id],
  }),
}));
