import { z } from "zod";

import { makeId } from "@/features/admin/plans/components/NewPlanPage/id";
import type { PlanDay } from "@/features/admin/plans/components/NewPlanPage/types";
import { SCHOOL_SUBJECT_OPTIONS } from "@/shared/const/subjects";
import { formatDateLocal } from "@/shared/utils/dates";

const subjectValues = new Set<string>(
  SCHOOL_SUBJECT_OPTIONS.map((subject) => subject.value),
);

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "استخدم صيغة التاريخ YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00`);
    return Number.isFinite(date.getTime()) && formatDateLocal(date) === value;
  }, "التاريخ غير صالح");

const taskSchema = z.object({
  title: z.string().trim().min(1, "عنوان المهمة مطلوب").max(255),
  subject: z
    .string()
    .refine((value) => subjectValues.has(value), "كود المادة غير صالح"),
  note: z.string().max(1000).optional(),
});

const daySchema = z.object({
  date: dateSchema,
  tasks: z.array(taskSchema).max(300),
});

const editablePlanJsonSchema = z
  .object({
    name: z.string().trim().min(1, "اسم الخطة مطلوب").max(255),
    startsOn: dateSchema,
    endsOn: dateSchema,
    days: z.array(daySchema),
  })
  .superRefine((plan, context) => {
    if (plan.endsOn < plan.startsOn) {
      context.addIssue({
        code: "custom",
        path: ["endsOn"],
        message: "تاريخ نهاية الخطة يجب أن يكون بعد تاريخ البداية",
      });
    }

    const seenDates = new Set<string>();
    let taskCount = 0;

    plan.days.forEach((day, index) => {
      taskCount += day.tasks.length;

      if (seenDates.has(day.date)) {
        context.addIssue({
          code: "custom",
          path: ["days", index, "date"],
          message: "لا يمكن تكرار نفس اليوم مرتين",
        });
      }
      seenDates.add(day.date);

      if (day.date < plan.startsOn || day.date > plan.endsOn) {
        context.addIssue({
          code: "custom",
          path: ["days", index, "date"],
          message: "اليوم يجب أن يكون داخل فترة الخطة",
        });
      }
    });

    if (taskCount > 300) {
      context.addIssue({
        code: "custom",
        path: ["days"],
        message: "لا يمكن أن تحتوي الخطة على أكثر من 300 مهمة",
      });
    }
  });

export type EditablePlanJson = z.infer<typeof editablePlanJsonSchema>;

export function stringifyEditablePlanJson(input: {
  name: string;
  startsOn: string;
  endsOn: string;
  days: PlanDay[];
}) {
  const document: EditablePlanJson = {
    name: input.name,
    startsOn: input.startsOn,
    endsOn: input.endsOn,
    days: input.days
      .filter((day) => day.tasks.length > 0)
      .map((day) => ({
        date: day.date,
        tasks: day.tasks.map((task) => ({
          title: task.title,
          subject: task.subject,
          ...(task.note?.trim() ? { note: task.note } : {}),
        })),
      })),
  };

  return JSON.stringify(document, null, 2);
}

export function parseEditablePlanJson(text: string):
  | { success: true; plan: EditablePlanJson; days: PlanDay[] }
  | { success: false; errors: string[] } {
  let value: unknown;

  try {
    value = JSON.parse(text);
  } catch {
    return { success: false, errors: ["صيغة JSON غير صحيحة. راجع الأقواس والفواصل وعلامات الاقتباس."] };
  }

  const result = editablePlanJsonSchema.safeParse(value);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => {
        const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        return `${path}${issue.message}`;
      }),
    };
  }

  const groupedDays = new Map(result.data.days.map((day) => [day.date, day.tasks]));
  const cursor = new Date(`${result.data.startsOn}T00:00:00`);
  const end = new Date(`${result.data.endsOn}T00:00:00`);
  const days: PlanDay[] = [];

  while (cursor <= end) {
    const date = formatDateLocal(cursor);
    days.push({
      date,
      tasks: (groupedDays.get(date) ?? []).map((task) => ({
        id: makeId(),
        title: task.title,
        subject: task.subject,
        note: task.note ?? "",
      })),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return { success: true, plan: result.data, days };
}
