ALTER TABLE "plans" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "coach_assignments_coach_student_uidx" ON "coach_assignments" USING btree ("coach_id","student_id");--> statement-breakpoint
CREATE INDEX "plans_coach_created_at_idx" ON "plans" USING btree ("coach_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "tasks_plan_status_idx" ON "tasks" USING btree ("plan_id","status");