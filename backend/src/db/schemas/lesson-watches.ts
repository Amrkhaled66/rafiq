import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { lessons } from './lessons';
import { users } from './users';

export const lessonWatches = pgTable(
  'lesson_watches',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    studentId: integer('student_id')
      .notNull()
      .references(() => users.id),
    scheduledOn: date('scheduled_on').notNull(),
    watchedOn: date('watched_on').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('lesson_watches_lesson_student_watched_on_uidx').on(
      table.lessonId,
      table.studentId,
      table.watchedOn,
    ),
  ],
);

export const lessonWatchesRelations = relations(lessonWatches, ({ one }) => ({
  lesson: one(lessons, {
    fields: [lessonWatches.lessonId],
    references: [lessons.id],
  }),
  student: one(users, {
    fields: [lessonWatches.studentId],
    references: [users.id],
  }),
}));
