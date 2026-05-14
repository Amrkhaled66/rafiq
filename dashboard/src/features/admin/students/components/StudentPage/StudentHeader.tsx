import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import UpdateStudentModal from "@/features/admin/students/components/StudentPage/UpdateStudentModal";
import type { Student } from "@/features/admin/students/services/studentService";
import Button from "@/shared/components/Button";
import GradeBadge from "@/shared/components/GradeBadge";
import {
  formatStudentDate,
  getStudentInitials,
  normalizePhoneForWhatsapp,
} from "./studentPageUtils";

export default function StudentHeader({ student }: { student: Student }) {
  const initials = getStudentInitials(student.fullName);
  const whatsappPhone = normalizePhoneForWhatsapp(student.phone);
  const navigate = useNavigate();

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
                تاريخ إنشاء الحساب: {formatStudentDate(student.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 place-items-end gap-3 lg:min-w-60">
          <Button variant="outline" className="w-full text-sm">
            تحليلات الاداء
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              navigate(`/students/${student.id}/plans`);
            }}
            className="w-full text-sm"
          >
            عرض الخطط
          </Button>

          <Button disabled variant="outline" className="w-full text-sm">
            عرض الدروس
          </Button>

          <UpdateStudentModal student={student}>
            <Button variant="outline" className="col-span-2 w-full text-sm">
              تعديل البيانات
            </Button>
          </UpdateStudentModal>

          <a
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-500 bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-transparent hover:text-emerald-600"
          >
            <Icon icon="ic:baseline-whatsapp" className="size-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
