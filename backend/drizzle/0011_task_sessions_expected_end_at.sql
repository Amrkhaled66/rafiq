ALTER TABLE "task_sessions" ADD COLUMN "expected_end_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "task_sessions_status_expected_end_at_idx" ON "task_sessions" USING btree ("status","expected_end_at");
