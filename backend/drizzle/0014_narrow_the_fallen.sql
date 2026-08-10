CREATE INDEX "lessons_student_weekday_idx" ON "lessons" USING btree ("student_id","weekday");--> statement-breakpoint
CREATE INDEX "plans_student_id_idx" ON "plans" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "tasks_plan_due_at_idx" ON "tasks" USING btree ("plan_id","due_at");