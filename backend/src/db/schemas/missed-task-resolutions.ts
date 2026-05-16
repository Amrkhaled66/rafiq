import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { users } from './users';

export const missedTaskResolutions = pgTable(
  'missed_task_resolutions',
  {
    id: serial('id').primaryKey(),
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    resolvedBy: integer('resolved_by')
      .notNull()
      .references(() => users.id),
    note: varchar('note', { length: 1000 }).notNull(),
    resolvedAt: timestamp('resolved_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('missed_task_resolutions_task_uidx').on(table.taskId),
    index('missed_task_resolutions_resolved_by_idx').on(table.resolvedBy),
  ],
);

export const missedTaskResolutionsRelations = relations(
  missedTaskResolutions,
  ({ one }) => ({
    task: one(tasks, {
      fields: [missedTaskResolutions.taskId],
      references: [tasks.id],
    }),
    resolvedByUser: one(users, {
      fields: [missedTaskResolutions.resolvedBy],
      references: [users.id],
    }),
  }),
);
