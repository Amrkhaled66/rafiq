import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { lessonWeekdayEnum } from './enum';
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
    scheduledForDate: date('scheduled_for_date').notNull(),
    scheduledWeekday: lessonWeekdayEnum('scheduled_weekday').notNull(),
    watchedOn: date('watched_on').notNull(),
    watchedOnTime: boolean('watched_on_time').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('lesson_watches_lesson_student_scheduled_for_date_uidx').on(
      table.lessonId,
      table.studentId,
      table.scheduledForDate,
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

