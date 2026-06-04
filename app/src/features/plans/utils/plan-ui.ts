import { Colors } from "@/shared/theme/theme";

import type { PlanStatus, StudyPlan } from "@/features/plans/types";

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

export function getPlanStatusAppearance(status: PlanStatus) {
  switch (status) {
    case "active":
      return {
        backgroundColor: Colors.light.soft,
        textColor: Colors.light.tint,
        iconBackgroundColor: Colors.light.soft,
        iconColor: Colors.light.tint,
      };
    case "upcoming":
      return {
        backgroundColor: "#FEF3C7",
        textColor: "#B45309",
        iconBackgroundColor: "#FEF3C7",
        iconColor: "#B45309",
      };
    default:
      return {
        backgroundColor: "#F3F4F6",
        textColor: "#6B7280",
        iconBackgroundColor: "#F3F4F6",
        iconColor: "#6B7280",
      };
  }
}

export function formatPlanDateRange(plan: StudyPlan) {
  return `${formatShortArabicDate(plan.startsOn)} - ${formatShortArabicDate(plan.endsOn)}`;
}

function formatShortArabicDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);

  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day} ${MONTH_NAMES_AR[month - 1]}`;
}
