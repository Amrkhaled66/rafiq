import { Icon } from "@iconify/react";
import type { Student, AssignedCoach } from "@/features/admin/students/services/studentService";
import GradeBadge from "@/shared/components/GradeBadge";
import {
  getStudentInitials,
  normalizePhoneForWhatsapp,
} from "@/features/admin/students/components/StudentPage/studentPageUtils";

export default function ProfileInfoSection({
  student,
  assignedCoaches,
}: {
  student: Student;
  assignedCoaches: AssignedCoach[];
}) {
  const initials = getStudentInitials(student.fullName);
  const coachesLabel =
    assignedCoaches.length > 0
      ? assignedCoaches.map((coach) => coach.fullName).join("، ")
      : "لا يوجد";

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-row gap-4 text-right">
          <div className="bg-brand-primary flex size-18 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm">
            {initials}
          </div>

          <div className="text-subTitle flex flex-col gap-3 text-sm sm:flex-wrap sm:gap-x-6">
            <div className="space-y-2">
              <h1 className="text-foreground text-3xl font-bold">
                {student.fullName}
              </h1>
            </div>

            <div className="flex gap-x-6">
              <div className="inline-flex items-center gap-2">
                <Icon
                  icon="solar:phone-linear"
                  className="text-brand-primary size-4"
                />
                <span>{student.phone}</span>
              </div>

              <div className="inline-flex items-center gap-2">
                <Icon
                  icon="solar:diploma-linear"
                  className="text-brand-primary size-4"
                />
                <GradeBadge grade={student.gradeLevel} />
              </div>
            </div>

            <div className="text-subTitle inline-flex items-center gap-2 text-sm">
              <Icon
                icon="solar:users-group-two-rounded-linear"
                className="text-brand-primary size-4"
              />
              <span>المدربون: {coachesLabel}</span>
            </div>
          </div>
        </div>

        {/* <div className="flex gap-3 lg:min-w-40">
          <a
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-emerald-500 bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-transparent hover:text-emerald-600"
          >
            <Icon icon="ic:baseline-whatsapp" className="size-5" />
          </a>
        </div> */}
      </div>
    </section>
  );
}
