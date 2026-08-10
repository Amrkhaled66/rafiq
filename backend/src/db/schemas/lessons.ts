import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { lessonWeekdayEnum, schoolSubjectEnum } from './enum';
import { lessonWatches } from './lesson-watches';
import { users } from './users';

export const lessons = pgTable(
  'lessons',
  {
    id: serial('id').primaryKey(),
    studentId: integer('student_id')
      .notNull()
      .references(() => users.id),
    name: varchar('name', { length: 255 }).notNull(),
    subject: schoolSubjectEnum('subject').notNull(),
    weekday: lessonWeekdayEnum('weekday').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('lessons_student_weekday_idx').on(table.studentId, table.weekday),
  ],
);

export const lessonsRelations = relations(lessons, ({ many, one }) => ({
  student: one(users, {
    fields: [lessons.studentId],
    references: [users.id],
  }),
  watchHistory: many(lessonWatches),
}));
