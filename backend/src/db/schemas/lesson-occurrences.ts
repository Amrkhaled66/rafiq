import { relations } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  lessonOccurrenceStatusEnum,
  lessonWeekdayEnum,
  schoolSubjectEnum,
} from './enum';
import { lessons } from './lessons';
import { subscriptions } from './subscriptions';
import { users } from './users';

export const lessonOccurrences = pgTable(
  'lesson_occurrences',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id),
    subscriptionId: integer('subscription_id').references(
      () => subscriptions.id,
    ),
    studentId: integer('student_id')
      .notNull()
      .references(() => users.id),
    lessonName: varchar('lesson_name', { length: 255 }).notNull(),
    subject: schoolSubjectEnum('subject').notNull(),
    scheduledForDate: date('scheduled_for_date').notNull(),
    scheduledWeekday: lessonWeekdayEnum('scheduled_weekday').notNull(),
    status: lessonOccurrenceStatusEnum('status').notNull().default('scheduled'),
    watchedOn: date('watched_on'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('lesson_occurrences_lesson_date_uidx').on(
      table.lessonId,
      table.scheduledForDate,
    ),
    index('lesson_occurrences_student_date_idx').on(
      table.studentId,
      table.scheduledForDate,
    ),
    index('lesson_occurrences_subscription_date_idx').on(
      table.subscriptionId,
      table.scheduledForDate,
    ),
    index('lesson_occurrences_status_date_idx').on(
      table.status,
      table.scheduledForDate,
    ),
  ],
);

export const lessonOccurrencesRelations = relations(
  lessonOccurrences,
  ({ one }) => ({
    lesson: one(lessons, {
      fields: [lessonOccurrences.lessonId],
      references: [lessons.id],
    }),
    subscription: one(subscriptions, {
      fields: [lessonOccurrences.subscriptionId],
      references: [subscriptions.id],
    }),
    student: one(users, {
      fields: [lessonOccurrences.studentId],
      references: [users.id],
    }),
  }),
);
