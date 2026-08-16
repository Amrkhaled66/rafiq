import { Colors, type AppPalette } from "@/shared/theme/theme";
import { getSubjectUi } from "@/shared/utils/subject-ui";

import type {
  PlanDetailTask,
  PlanStatus,
  PlanTaskStatus,
  StudyPlan,
} from "@/features/plans/types";

const MONTH_NAMES_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export function getPlanStatusLabel(status: PlanStatus) {
  switch (status) {
    case "active":
      return "نشطة";
    case "upcoming":
      return "قادمة";
    default:
      return "منتهية";
  }
}

export function getPlanStatusAppearance(
  status: PlanStatus,
  palette: AppPalette = Colors.light,
) {
  const isDark = palette === Colors.dark;

  switch (status) {
    case "active":
      return {
        backgroundColor: palette.soft,
        textColor: palette.tint,
        iconBackgroundColor: palette.soft,
        iconColor: palette.tint,
      };
    case "upcoming":
      return {
        backgroundColor: isDark ? "#4A3514" : "#FEF3C7",
        textColor: isDark ? "#FCD34D" : "#B45309",
        iconBackgroundColor: isDark ? "#4A3514" : "#FEF3C7",
        iconColor: isDark ? "#FCD34D" : "#B45309",
      };
    default:
      return {
        backgroundColor: isDark ? "#342B2C" : "#F3F4F6",
        textColor: isDark ? "#BFAEB0" : "#6B7280",
        iconBackgroundColor: isDark ? "#342B2C" : "#F3F4F6",
        iconColor: isDark ? "#BFAEB0" : "#6B7280",
      };
  }
}

export function formatPlanDateRange(plan: StudyPlan) {
  return `${formatShortArabicDate(plan.startsOn)} - ${formatShortArabicDate(plan.endsOn)}`;
}

export function formatPlanDateRangeFromValues(startsOn: string, endsOn: string) {
  return `${formatShortArabicDate(startsOn)} - ${formatFullArabicDate(endsOn)}`;
}

export function formatShortArabicDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);

  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day} ${MONTH_NAMES_AR[month - 1]}`;
}

export function formatFullArabicDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);

  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day} ${MONTH_NAMES_AR[month - 1]} ${year}`;
}

export function getDayMonthName(dateValue: string) {
  const [, month] = dateValue.split("-").map(Number);

  if (!month) {
    return dateValue;
  }

  return MONTH_NAMES_AR[month - 1];
}

export function getDayNumber(dateValue: string) {
  const [, , day] = dateValue.split("-").map(Number);
  return day ? String(day) : dateValue;
}

export function getArabicPlanDayLabel(dayOrder: number): string {
  const labels: Record<number, string> = {
    1: "اليوم الأول",
    2: "اليوم الثاني",
    3: "اليوم الثالث",
    4: "اليوم الرابع",
    5: "اليوم الخامس",
    6: "اليوم السادس",
    7: "اليوم السابع",
    8: "اليوم الثامن",
    9: "اليوم التاسع",
    10: "اليوم العاشر",
    11: "اليوم الحادي عشر",
    12: "اليوم الثاني عشر",
    13: "اليوم الثالث عشر",
    14: "اليوم الرابع عشر",
    15: "اليوم الخامس عشر",
    16: "اليوم السادس عشر",
    17: "اليوم السابع عشر",
    18: "اليوم الثامن عشر",
    19: "اليوم التاسع عشر",
    20: "اليوم العشرون",
    21: "اليوم الحادي والعشرون",
    22: "اليوم الثاني والعشرون",
    23: "اليوم الثالث والعشرون",
    24: "اليوم الرابع والعشرون",
    25: "اليوم الخامس والعشرون",
    26: "اليوم السادس والعشرون",
    27: "اليوم السابع والعشرون",
    28: "اليوم الثامن والعشرون",
    29: "اليوم التاسع والعشرون",
    30: "اليوم الثلاثون",
  };

  return labels[dayOrder] ?? `اليوم ${dayOrder}`;
}

export function calculateInclusivePlanDays(startsOn: string, endsOn: string) {
  const start = new Date(`${startsOn}T00:00:00`);
  const end = new Date(`${endsOn}T00:00:00`);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff < 0) {
    return 0;
  }

  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export function getTodayCairoDateString() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

export function formatArabicTodayDateLabel() {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Cairo",
  }).format(new Date());
}

export function getDefaultSelectedPlanDay(days: { date: string }[]) {
  const today = getTodayCairoDateString();
  return days.find((day) => day.date === today)?.date ?? days[0]?.date ?? null;
}

export function getPlanTaskStatusAppearance(
  status: PlanTaskStatus,
  palette: AppPalette = Colors.light,
) {
  const isDark = palette === Colors.dark;

  switch (status) {
    case "done":
      return {
        label: "مكتملة",
        backgroundColor: isDark ? "#143A27" : "#DCFCE7",
        textColor: isDark ? "#86EFAC" : "#166534",
      };
    case "missed":
      return {
        label: "فاتت",
        backgroundColor: isDark ? "#4A1D20" : "#FEE2E2",
        textColor: isDark ? "#FCA5A5" : "#DC2626",
      };
    case "in_progress":
      return {
        label: "قيد التنفيذ",
        backgroundColor: palette.soft,
        textColor: palette.tint,
      };
    default:
      return {
        label: "لم تبدأ",
        backgroundColor: isDark ? "#4A3514" : "#FEF3C7",
        textColor: isDark ? "#FCD34D" : "#B45309",
      };
  }
}

export function mapPlanTaskToTaskCard(task: PlanDetailTask) {
  const subjectUi = getSubjectUi(task.subject);

  return {
    id: String(task.id),
    title: task.title,
    subject: subjectUi.label,
    icon: subjectUi.icon,
    iconBackgroundColor: subjectUi.iconBackgroundColor,
    iconColor: subjectUi.iconColor,
  };
}
