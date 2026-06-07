import type { PlanDetailResponse } from "@/features/plans/types";

export const MOCK_PLAN_DETAILS: Record<number, PlanDetailResponse> = {
  1: {
    plan: {
      id: 1,
      name: "خطة الأسبوع الحالي",
      startsOn: "2025-06-03",
      endsOn: "2025-06-09",
      createdAt: "2025-06-01T09:00:00.000Z",
      coachId: 7,
    },
    stats: {
      totalTasks: 7,
      completedTasks: 3,
      pendingTasks: 3,
      missedTasks: 1,
      progressPercent: 43,
    },
    days: [
      {
        date: "2025-06-03",
        weekday: "الثلاثاء",
        progressPercent: 50,
        tasks: [
          {
            id: 101,
            title: "حل واجب الفيزياء",
            subject: "physics",
            status: "in_progress",
          },
          {
            id: 102,
            title: "مراجعة الأحياء",
            subject: "biology",
            status: "done",
          },
        ],
      },
      {
        date: "2025-06-04",
        weekday: "الأربعاء",
        progressPercent: 33,
        tasks: [
          {
            id: 103,
            title: "تدريبات الرياضيات",
            subject: "math",
            status: "pending",
          },
          {
            id: 104,
            title: "تلخيص نص القراءة",
            subject: "arabic",
            status: "in_progress",
          },
          {
            id: 105,
            title: "مراجعة الباب الثالث",
            subject: "chemistry",
            status: "missed",
          },
        ],
      },
      {
        date: "2025-06-05",
        weekday: "الخميس",
        progressPercent: 0,
        tasks: [],
      },
      {
        date: "2025-06-06",
        weekday: "الجمعة",
        progressPercent: 50,
        tasks: [
          {
            id: 106,
            title: "حل كلمات الإنجليزي",
            subject: "english",
            status: "done",
          },
          {
            id: 107,
            title: "قراءة أسئلة التاريخ",
            subject: "history",
            status: "pending",
          },
        ],
      },
    ],
  },
  2: {
    plan: {
      id: 2,
      name: "خطة الأسبوع القادم",
      startsOn: "2025-06-10",
      endsOn: "2025-06-16",
      createdAt: "2025-06-02T09:00:00.000Z",
      coachId: 7,
    },
    stats: {
      totalTasks: 4,
      completedTasks: 0,
      pendingTasks: 4,
      missedTasks: 0,
      progressPercent: 0,
    },
    days: [
      {
        date: "2025-06-10",
        weekday: "الثلاثاء",
        progressPercent: 0,
        tasks: [
          {
            id: 201,
            title: "مراجعة شاملة للأحياء",
            subject: "biology",
            status: "pending",
          },
        ],
      },
      {
        date: "2025-06-11",
        weekday: "الأربعاء",
        progressPercent: 0,
        tasks: [
          {
            id: 202,
            title: "مراجعة قوانين الفيزياء",
            subject: "physics",
            status: "pending",
          },
        ],
      },
      {
        date: "2025-06-12",
        weekday: "الخميس",
        progressPercent: 0,
        tasks: [],
      },
      {
        date: "2025-06-13",
        weekday: "الجمعة",
        progressPercent: 0,
        tasks: [
          {
            id: 203,
            title: "نماذج امتحان الرياضيات",
            subject: "math",
            status: "pending",
          },
          {
            id: 204,
            title: "مراجعة التعبير العربي",
            subject: "arabic",
            status: "pending",
          },
        ],
      },
    ],
  },
};
