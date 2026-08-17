CREATE TYPE "public"."lesson_occurrence_status" AS ENUM('scheduled', 'watched_on_time', 'missed', 'watched_late');--> statement-breakpoint
CREATE TABLE "lesson_occurrences" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"lesson_name" varchar(255) NOT NULL,
	"subject" "school_subject" NOT NULL,
	"scheduled_for_date" date NOT NULL,
	"scheduled_weekday" "lesson_weekday" NOT NULL,
	"status" "lesson_occurrence_status" DEFAULT 'scheduled' NOT NULL,
	"watched_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "missed_lesson_resolutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"occurrence_id" integer NOT NULL,
	"resolved_by" integer NOT NULL,
	"note" varchar(1000) NOT NULL,
	"resolved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lesson_watches" ADD COLUMN "occurrence_id" integer;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "tracking_starts_on" date DEFAULT (now() at time zone 'Africa/Cairo')::date NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "occurrences_generated_through" date;--> statement-breakpoint
ALTER TABLE "lesson_occurrences" ADD CONSTRAINT "lesson_occurrences_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_occurrences" ADD CONSTRAINT "lesson_occurrences_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missed_lesson_resolutions" ADD CONSTRAINT "missed_lesson_resolutions_occurrence_id_lesson_occurrences_id_fk" FOREIGN KEY ("occurrence_id") REFERENCES "public"."lesson_occurrences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missed_lesson_resolutions" ADD CONSTRAINT "missed_lesson_resolutions_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_occurrences_lesson_date_uidx" ON "lesson_occurrences" USING btree ("lesson_id","scheduled_for_date");--> statement-breakpoint
CREATE INDEX "lesson_occurrences_student_date_idx" ON "lesson_occurrences" USING btree ("student_id","scheduled_for_date");--> statement-breakpoint
CREATE INDEX "lesson_occurrences_status_date_idx" ON "lesson_occurrences" USING btree ("status","scheduled_for_date");--> statement-breakpoint
CREATE UNIQUE INDEX "missed_lesson_resolutions_occurrence_uidx" ON "missed_lesson_resolutions" USING btree ("occurrence_id");--> statement-breakpoint
CREATE INDEX "missed_lesson_resolutions_resolved_by_idx" ON "missed_lesson_resolutions" USING btree ("resolved_by");--> statement-breakpoint
ALTER TABLE "lesson_watches" ADD CONSTRAINT "lesson_watches_occurrence_id_lesson_occurrences_id_fk" FOREIGN KEY ("occurrence_id") REFERENCES "public"."lesson_occurrences"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_watches_occurrence_uidx" ON "lesson_watches" USING btree ("occurrence_id");