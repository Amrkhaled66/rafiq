DELETE FROM "tasks" WHERE "subject" IN ('geology','philosophy','psychology','french','german','italian','spanish','computer_science','economics');--> statement-breakpoint
DELETE FROM "lesson_occurrences" WHERE "subject" IN ('geology','philosophy','psychology','french','german','italian','spanish','computer_science','economics');--> statement-breakpoint
DELETE FROM "lessons" WHERE "subject" IN ('geology','philosophy','psychology','french','german','italian','spanish','computer_science','economics');--> statement-breakpoint
ALTER TYPE "school_subject" ADD VALUE IF NOT EXISTS 'second_foreign_language';
