ALTER TYPE "public"."session_status" ADD VALUE IF NOT EXISTS 'paused';--> statement-breakpoint
ALTER TYPE "public"."session_status" ADD VALUE IF NOT EXISTS 'cancelled';--> statement-breakpoint
ALTER TABLE "task_sessions" ADD COLUMN "accumulated_seconds" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "task_sessions" ADD COLUMN "last_started_at" timestamp with time zone;--> statement-breakpoint
UPDATE "task_sessions"
SET "status" = 'cancelled'
WHERE "status"::text = 'stopped';--> statement-breakpoint
UPDATE "task_sessions"
SET "last_started_at" = "started_at"
WHERE "status" = 'running';--> statement-breakpoint
UPDATE "task_sessions"
SET "accumulated_seconds" = greatest(
  0,
  extract(epoch from ("ended_at" - "started_at"))::integer
)
WHERE "ended_at" IS NOT NULL
  AND "status" IN ('completed', 'cancelled');
