import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const coachAssignments = pgTable(
  'coach_assignments',
  {
    id: serial('id').primaryKey(),
    coachId: integer('coach_id')
      .notNull()
      .references(() => users.id),
    studentId: integer('student_id')
      .notNull()
      .references(() => users.id),
    assignedAt: timestamp('assigned_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('coach_assignments_coach_student_uidx').on(
      table.coachId,
      table.studentId,
    ),
  ],
);

export const coachAssignmentsRelations = relations(
  coachAssignments,
  ({ one }) => ({
    coach: one(users, {
      fields: [coachAssignments.coachId],
      references: [users.id],
      relationName: 'coach_assignments_coach',
    }),
    student: one(users, {
      fields: [coachAssignments.studentId],
      references: [users.id],
      relationName: 'coach_assignments_student',
    }),
  }),
);
