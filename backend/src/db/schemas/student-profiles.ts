import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { egyptCityEnum, gradeLevelEnum } from './enum';
import { users } from './users';

export const studentProfiles = pgTable('student_profiles', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  city: egyptCityEnum('city').notNull(),
  parentPhone: varchar('parent_phone', { length: 32 }).notNull(),
  gradeLevel: gradeLevelEnum('grade_level').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
}));
