import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { lessonOccurrences } from './lesson-occurrences';
import { users } from './users';

export const missedLessonResolutions = pgTable(
  'missed_lesson_resolutions',
  {
    id: serial('id').primaryKey(),
    occurrenceId: integer('occurrence_id')
      .notNull()
      .references(() => lessonOccurrences.id, { onDelete: 'cascade' }),
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
    uniqueIndex('missed_lesson_resolutions_occurrence_uidx').on(
      table.occurrenceId,
    ),
    index('missed_lesson_resolutions_resolved_by_idx').on(table.resolvedBy),
  ],
);

export const missedLessonResolutionsRelations = relations(
  missedLessonResolutions,
  ({ one }) => ({
    occurrence: one(lessonOccurrences, {
      fields: [missedLessonResolutions.occurrenceId],
      references: [lessonOccurrences.id],
    }),
    resolvedByUser: one(users, {
      fields: [missedLessonResolutions.resolvedBy],
      references: [users.id],
    }),
  }),
);
