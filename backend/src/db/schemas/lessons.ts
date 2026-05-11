import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { schoolSubjectEnum } from './enum';
import { users } from './users';

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id')
    .notNull()
    .references(() => users.id),
  subject: schoolSubjectEnum('subject').notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const lessonsRelations = relations(lessons, ({ one }) => ({
  student: one(users, {
    fields: [lessons.studentId],
    references: [users.id],
  }),
}));
