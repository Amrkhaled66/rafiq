import type { StudyPlan } from "@/features/plans/types";

export const PLANS_DATE_LABEL = "الأربعاء، 3 يونيو 2025";

export const MOCK_PLANS: StudyPlan[] = [
  {
    id: 1,
    name: "خطة الأسبوع الحالي",
    startsOn: "2025-06-03",
    endsOn: "2025-06-09",
    status: "active",
    icon: "calendar-outline",
  },
  {
    id: 2,
    name: "خطة الأسبوع القادم",
    startsOn: "2025-06-10",
    endsOn: "2025-06-16",
    status: "upcoming",
    icon: "time-outline",
  },
  {
    id: 3,
    name: "خطة الأسبوع الماضي",
    startsOn: "2025-05-27",
    endsOn: "2025-06-02",
    status: "ended",
    icon: "checkmark-done-outline",
  },
];
