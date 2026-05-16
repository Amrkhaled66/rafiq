ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "name" varchar(255);
--> statement-breakpoint
UPDATE "plans" SET "name" = ('Plan #' || "id") WHERE "name" IS NULL;
--> statement-breakpoint
ALTER TABLE "plans" ALTER COLUMN "name" SET NOT NULL;
