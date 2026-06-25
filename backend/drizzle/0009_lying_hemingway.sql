ALTER TABLE "subscriptions" ALTER COLUMN "starts_at" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "ends_at" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "task_sessions" ADD COLUMN "student_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "task_sessions" ADD CONSTRAINT "task_sessions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;