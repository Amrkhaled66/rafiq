ALTER TABLE "lesson_occurrences" ADD COLUMN "subscription_id" integer;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "cancelled_by" integer;--> statement-breakpoint
ALTER TABLE "lesson_occurrences" ADD CONSTRAINT "lesson_occurrences_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_cancelled_by_users_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lesson_occurrences_subscription_date_idx" ON "lesson_occurrences" USING btree ("subscription_id","scheduled_for_date");--> statement-breakpoint
UPDATE "lesson_occurrences" lo
SET "subscription_id" = (
  SELECT s."id"
  FROM "subscriptions" s
  WHERE s."student_id" = lo."student_id"
    AND lo."scheduled_for_date" >= s."starts_at"
    AND lo."scheduled_for_date" <= s."ends_at"
  ORDER BY (s."cancelled_at" IS NULL) DESC, s."starts_at" DESC, s."id" DESC
  LIMIT 1
);--> statement-breakpoint
DELETE FROM "lesson_occurrences"
WHERE "subscription_id" IS NULL
  AND "status" = 'scheduled'
  AND "scheduled_for_date" > (now() at time zone 'Africa/Cairo')::date;--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "occurrences_generated_through";
