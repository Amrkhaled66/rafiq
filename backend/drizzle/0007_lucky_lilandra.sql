CREATE TABLE "missed_task_resolutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"resolved_by" integer NOT NULL,
	"resolved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "missed_task_resolutions" ADD CONSTRAINT "missed_task_resolutions_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "missed_task_resolutions" ADD CONSTRAINT "missed_task_resolutions_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "missed_task_resolutions_task_uidx" ON "missed_task_resolutions" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "missed_task_resolutions_resolved_by_idx" ON "missed_task_resolutions" USING btree ("resolved_by");