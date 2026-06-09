import type {
  StudentPlanListItem,
  StudentPlansResponse,
  StudyPlan,
} from "@/features/plans/types";

function getPlanIcon(status: StudyPlan["status"]): StudyPlan["icon"] {
  switch (status) {
    case "active":
      return "calendar-outline";
    case "upcoming":
      return "time-outline";
    default:
      return "checkmark-done-outline";
  }
}

function mapPlan(plan: StudentPlanListItem): StudyPlan {
  return {
    id: plan.id,
    name: plan.name,
    startsOn: plan.startsOn,
    endsOn: plan.endsOn,
    status: plan.status,
    icon: getPlanIcon(plan.status),
  };
}

export function mapStudentPlansToViewModel(response: StudentPlansResponse) {
  return {
    plans: response.items.map(mapPlan),
  };
}
