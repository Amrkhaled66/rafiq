import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/shared/components/Button";
import GradeBadge from "@/shared/components/GradeBadge";
import { formatProfileDate, getUserInitials } from "@/shared/utils/profile";
import type { StudentGrade } from "@/shared/const/grades";

export type StudentPlansHeaderStudent = {
  id: number;
  fullName: string;
  phone: string;
  gradeLevel: StudentGrade;
  createdAt: string;
};

export default function StudentPlansHeader({
  student,
}: {
  student: StudentPlansHeaderStudent;
}) {
  const navigate = useNavigate();
  const initials = getUserInitials(student.fullName);

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
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
                icon="solar:calendar-mark-linear"
                className="text-brand-primary size-4"
              />
              <span>
                تاريخ إنشاء الحساب: {formatProfileDate(student.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="">
          <Link to="new">
            <Button className="w-full text-sm">إضافة خطة جديدة</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
