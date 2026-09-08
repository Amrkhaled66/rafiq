CREATE TYPE "public"."egypt_city" AS ENUM('cairo', 'giza', 'alexandria', 'dakahlia', 'red_sea', 'beheira', 'fayoum', 'gharbia', 'ismailia', 'monufia', 'minya', 'qalyubia', 'new_valley', 'suez', 'aswan', 'assiut', 'beni_suef', 'port_said', 'damietta', 'sharqia', 'south_sinai', 'kafr_el_sheikh', 'matrouh', 'luxor', 'qena', 'north_sinai', 'sohag');--> statement-breakpoint
CREATE TYPE "public"."grade_level" AS ENUM('first_sec', 'second_sec', 'third_sec');--> statement-breakpoint
CREATE TYPE "public"."lesson_occurrence_status" AS ENUM('scheduled', 'watched_on_time', 'missed', 'watched_late');--> statement-breakpoint
CREATE TYPE "public"."lesson_weekday" AS ENUM('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday');--> statement-breakpoint
CREATE TYPE "public"."school_subject" AS ENUM('arabic', 'english', 'second_foreign_language', 'math', 'physics', 'chemistry', 'biology', 'history', 'geography', 'statistics', 'religion', 'national_education');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('running', 'paused', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('pending', 'in_progress', 'done', 'missed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'coach', 'super_admin');--> statement-breakpoint
CREATE TABLE "coach_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"coach_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_occurrences" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"subscription_id" integer,
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
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"subject" "school_subject" NOT NULL,
	"weekday" "lesson_weekday" NOT NULL,
	"tracking_starts_on" date DEFAULT (now() at time zone 'Africa/Cairo')::date NOT NULL,
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
CREATE TABLE "missed_task_resolutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"resolved_by" integer NOT NULL,
	"note" varchar(1000) NOT NULL,
	"resolved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"student_id" integer NOT NULL,
	"coach_id" integer NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"city" "egypt_city" NOT NULL,
	"parent_phone" varchar(32) NOT NULL,
	"grade_level" "grade_level" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"duration_days" integer NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"package_id" integer NOT NULL,
	"starts_at" date NOT NULL,
	"ends_at" date NOT NULL,
	"amount_paid" integer NOT NULL,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text,
	"cancelled_by" integer,
	"created_by" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone,
	"expected_end_at" timestamp with time zone,
	"accumulated_seconds" integer DEFAULT 0 NOT NULL,
	"last_started_at" timestamp with time zone,
	"status" "session_status" DEFAULT 'running' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"note" text,
	"subject" "school_subject" NOT NULL,
	"due_at" date NOT NULL,
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "coach_assignments" ADD CONSTRAINT "coach_assignments_coach_id_users_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_assignments" ADD CONSTRAINT "coach_assignments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_occurrences" ADD CONSTRAINT "lesson_occurrences_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_occurrences" ADD CONSTRAINT "lesson_occurrences_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_occurrences" ADD CONSTRAINT "lesson_occurrences_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missed_lesson_resolutions" ADD CONSTRAINT "missed_lesson_resolutions_occurrence_id_lesson_occurrences_id_fk" FOREIGN KEY ("occurrence_id") REFERENCES "public"."lesson_occurrences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missed_lesson_resolutions" ADD CONSTRAINT "missed_lesson_resolutions_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missed_task_resolutions" ADD CONSTRAINT "missed_task_resolutions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missed_task_resolutions" ADD CONSTRAINT "missed_task_resolutions_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_coach_id_users_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_package_id_subscription_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."subscription_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_cancelled_by_users_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_sessions" ADD CONSTRAINT "task_sessions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_sessions" ADD CONSTRAINT "task_sessions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "coach_assignments_coach_student_uidx" ON "coach_assignments" USING btree ("coach_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_occurrences_lesson_date_uidx" ON "lesson_occurrences" USING btree ("lesson_id","scheduled_for_date");--> statement-breakpoint
CREATE INDEX "lesson_occurrences_student_date_idx" ON "lesson_occurrences" USING btree ("student_id","scheduled_for_date");--> statement-breakpoint
CREATE INDEX "lesson_occurrences_subscription_date_idx" ON "lesson_occurrences" USING btree ("subscription_id","scheduled_for_date");--> statement-breakpoint
CREATE INDEX "lesson_occurrences_status_date_idx" ON "lesson_occurrences" USING btree ("status","scheduled_for_date");--> statement-breakpoint
CREATE INDEX "lessons_student_weekday_idx" ON "lessons" USING btree ("student_id","weekday");--> statement-breakpoint
CREATE UNIQUE INDEX "missed_lesson_resolutions_occurrence_uidx" ON "missed_lesson_resolutions" USING btree ("occurrence_id");--> statement-breakpoint
CREATE INDEX "missed_lesson_resolutions_resolved_by_idx" ON "missed_lesson_resolutions" USING btree ("resolved_by");--> statement-breakpoint
CREATE UNIQUE INDEX "missed_task_resolutions_task_uidx" ON "missed_task_resolutions" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "missed_task_resolutions_resolved_by_idx" ON "missed_task_resolutions" USING btree ("resolved_by");--> statement-breakpoint
CREATE INDEX "plans_student_id_idx" ON "plans" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "plans_coach_created_at_idx" ON "plans" USING btree ("coach_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "subscriptions_active_student_dates_idx" ON "subscriptions" USING btree ("student_id","starts_at","ends_at") WHERE "subscriptions"."cancelled_at" is null;--> statement-breakpoint
CREATE INDEX "subscriptions_active_ends_at_idx" ON "subscriptions" USING btree ("ends_at") WHERE "subscriptions"."cancelled_at" is null;--> statement-breakpoint
CREATE INDEX "task_sessions_student_task_idx" ON "task_sessions" USING btree ("student_id","task_id");--> statement-breakpoint
CREATE INDEX "task_sessions_status_expected_end_at_idx" ON "task_sessions" USING btree ("status","expected_end_at");--> statement-breakpoint
CREATE INDEX "tasks_plan_due_at_idx" ON "tasks" USING btree ("plan_id","due_at");--> statement-breakpoint
CREATE INDEX "tasks_due_at_idx" ON "tasks" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "tasks_plan_status_idx" ON "tasks" USING btree ("plan_id","status");--> statement-breakpoint
CREATE INDEX "tasks_status_due_at_idx" ON "tasks" USING btree ("status","due_at");