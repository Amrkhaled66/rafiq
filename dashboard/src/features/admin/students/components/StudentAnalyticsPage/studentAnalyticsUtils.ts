import type {
  StudentStudyTimeDailyPoint,
  StudentTaskCompletionTrendPoint,
} from "@/features/admin/students/services/studentService";
import { SCHOOL_SUBJECT_LABELS } from "@/shared/const/subjects";
import { formatDateLocal } from "@/shared/utils/dates";

const DAY_MS = 86_400_000;

export const ANALYTICS_PRESETS = [
  { days: 7, label: "7 أيام" },
  { days: 30, label: "30 يوم" },
  { days: 90, label: "90 يوم" },
] as const;

export function addDays(date: string, days: number) {
  const nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + days);
  return formatDateLocal(nextDate);
}

export function getCairoToday() {
  return formatDateLocal(
    new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })),
  );
}

export function getPresetRange(days: number) {
  const to = getCairoToday();

  return {
    from: addDays(to, -(days - 1)),
    to,
  };
}

export function countDays(from: string, to: string) {
  const fromTime = new Date(`${from}T00:00:00`).getTime();
  const toTime = new Date(`${to}T00:00:00`).getTime();

  if (Number.isNaN(fromTime) || Number.isNaN(toTime) || toTime < fromTime) {
    return 0;
  }

  return Math.floor((toTime - fromTime) / DAY_MS) + 1;
}

export function fillTaskCompletionTrend(
  points: StudentTaskCompletionTrendPoint[],
  from: string,
  to: string,
) {
  const pointByDate = new Map(points.map((point) => [point.date, point]));
  const totalDays = countDays(from, to);

  return Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(from, index);
    return (
      pointByDate.get(date) ?? {
        date,
        totalTasks: 0,
        completedTasks: 0,
        missedTasks: 0,
        completionRate: 0,
      }
    );
  });
}

export function fillDailyStudyTime(
  points: StudentStudyTimeDailyPoint[],
  from: string,
  to: string,
) {
  const pointByDate = new Map(points.map((point) => [point.date, point]));
  const totalDays = countDays(from, to);

  return Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(from, index);
    return (
      pointByDate.get(date) ?? {
        date,
        totalStudySeconds: 0,
        totalStudyMinutes: 0,
        sessionsCount: 0,
      }
    );
  });
}

export function getSubjectLabel(subject: string) {
  return SCHOOL_SUBJECT_LABELS[subject] ?? subject;
}

export function formatStudyMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} دقيقة`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ساعة`;
  }

  return `${hours} ساعة و${remainingMinutes} دقيقة`;
}
