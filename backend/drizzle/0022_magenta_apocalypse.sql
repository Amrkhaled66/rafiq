ALTER TABLE "lesson_occurrences" ALTER COLUMN "subject" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "subject" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "subject" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."school_subject";--> statement-breakpoint
CREATE TYPE "public"."school_subject" AS ENUM('arabic', 'english', 'second_foreign_language', 'math', 'physics', 'chemistry', 'biology', 'history', 'geography', 'statistics', 'religion', 'national_education');--> statement-breakpoint
ALTER TABLE "lesson_occurrences" ALTER COLUMN "subject" SET DATA TYPE "public"."school_subject" USING "subject"::"public"."school_subject";--> statement-breakpoint
ALTER TABLE "lessons" ALTER COLUMN "subject" SET DATA TYPE "public"."school_subject" USING "subject"::"public"."school_subject";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "subject" SET DATA TYPE "public"."school_subject" USING "subject"::"public"."school_subject";