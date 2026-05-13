CREATE TYPE "public"."egypt_city" AS ENUM('cairo', 'giza', 'alexandria', 'dakahlia', 'red_sea', 'beheira', 'fayoum', 'gharbia', 'ismailia', 'monufia', 'minya', 'qalyubia', 'new_valley', 'suez', 'aswan', 'assiut', 'beni_suef', 'port_said', 'damietta', 'sharqia', 'south_sinai', 'kafr_el_sheikh', 'matrouh', 'luxor', 'qena', 'north_sinai', 'sohag');--> statement-breakpoint
CREATE TYPE "public"."grade_level" AS ENUM('first_sec', 'second_sec', 'third_sec');--> statement-breakpoint
CREATE TYPE "public"."school_subject" AS ENUM('arabic', 'english', 'math', 'physics', 'chemistry', 'biology', 'geology', 'history', 'geography', 'philosophy', 'psychology', 'french', 'german', 'italian', 'spanish', 'computer_science', 'religion', 'national_education', 'economics', 'statistics');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('running', 'completed', 'stopped');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('pending', 'in_progress', 'done', 'missed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'coach', 'super_admin');--> statement-breakpoint
CREATE TABLE "coach_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"coach_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"subject" "school_subject" NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"coach_id" integer NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
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
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"amount_paid" integer NOT NULL,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text,
	"created_by" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone,
	"status" "session_status" DEFAULT 'running' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"subject" "school_subject" NOT NULL,
	"due_at" timestamp with time zone,
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
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_coach_id_users_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_package_id_subscription_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."subscription_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_sessions" ADD CONSTRAINT "task_sessions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;