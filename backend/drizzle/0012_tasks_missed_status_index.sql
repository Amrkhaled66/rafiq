CREATE INDEX "tasks_status_due_at_idx" ON "tasks" USING btree ("status", "due_at");
