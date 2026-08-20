import { Icon } from "@iconify/react";
import type {
  AssignedCoach,
  Student,
} from "@/features/admin/students/services/studentService";
import { getStudentInitials } from "@/features/admin/students/components/StudentPage/studentPageUtils";
import GradeBadge from "@/shared/components/GradeBadge";

export default function ProfileInfoSection({
  student,
  assignedCoaches,
}: {
  student: Student;
  assignedCoaches: AssignedCoach[];
}) {
  const coachesLabel = assignedCoaches.length
    ? assignedCoaches.map((coach) => coach.fullName).join("، ")
    : "لا يوجد مدربون معينون";

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="flex min-w-0 items-start gap-4 text-right">
        <div className="bg-brand-primary flex size-16 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm sm:size-18 sm:text-xl">
          {getStudentInitials(student.fullName)}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-foreground truncate text-2xl font-bold sm:text-3xl">
            {student.fullName}
          </h2>
          <div className="text-subTitle mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-2" dir="ltr">
              {student.phone}
              <Icon icon="solar:phone-linear" className="text-brand-primary size-4" />
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon icon="solar:diploma-linear" className="text-brand-primary size-4" />
              <GradeBadge grade={student.gradeLevel} />
            </span>
            <span className="inline-flex min-w-0 items-center gap-2">
              <Icon
                icon="solar:users-group-two-rounded-linear"
                className="text-brand-primary size-4 shrink-0"
              />
              <span className="truncate">المدربون: {coachesLabel}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
