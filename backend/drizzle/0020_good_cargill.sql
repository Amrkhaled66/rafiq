UPDATE "lesson_occurrences" lo
SET
  "watched_on" = lw."watched_on",
  "status" = CASE
    WHEN lw."watched_on_time" THEN 'watched_on_time'::"lesson_occurrence_status"
    ELSE 'watched_late'::"lesson_occurrence_status"
  END,
  "updated_at" = now()
FROM "lesson_watches" lw
WHERE (
    lw."occurrence_id" = lo."id"
    OR (
      lw."occurrence_id" IS NULL
      AND lw."lesson_id" = lo."lesson_id"
      AND lw."student_id" = lo."student_id"
      AND lw."scheduled_for_date" = lo."scheduled_for_date"
    )
  )
  AND lo."watched_on" IS NULL;--> statement-breakpoint
DROP TABLE "lesson_watches" CASCADE;