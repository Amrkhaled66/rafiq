CREATE TYPE "public"."lesson_weekday" AS ENUM('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday');--> statement-breakpoint
ALTER TABLE "lesson_watches" RENAME COLUMN "scheduled_on" TO "scheduled_for_date";--> statement-breakpoint
DROP INDEX "lesson_watches_lesson_student_watched_on_uidx";--> statement-breakpoint
ALTER TABLE "lesson_watches" ADD COLUMN "scheduled_weekday" "lesson_weekday" NOT NULL;--> statement-breakpoint
ALTER TABLE "lesson_watches" ADD COLUMN "watched_on_time" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "weekday" "lesson_weekday" NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_watches_lesson_student_scheduled_for_date_uidx" ON "lesson_watches" USING btree ("lesson_id","student_id","scheduled_for_date");--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "scheduled_at";