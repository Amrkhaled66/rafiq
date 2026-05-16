import { Icon } from "@iconify/react";
import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";

import type { Lesson } from "@/features/admin/lessons/services/lessonService";
import Button from "@/shared/components/Button";
import Table from "@/shared/components/Table";
import { SCHOOL_SUBJECT_LABELS } from "@/shared/const/subjects";
import {
  formatDateArShort2DigitDay,
  getDayNameAr,
} from "@/shared/utils/dates";

type StudentLessonsTableProps = {
  lessons: Lesson[];
  isLoading?: boolean;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lesson: Lesson) => void;
};

export default function StudentLessonsTable({
  lessons,
  isLoading = false,
  onEditLesson,
  onDeleteLesson,
}: StudentLessonsTableProps) {
  const columns = useMemo<TableColumn<Lesson>[]>(
    () => [
      {
        name: "اسم الدرس",
        selector: (row) => row.name,
        grow: 1.5,
      },
      {
        name: "المادة",
        selector: (row) => SCHOOL_SUBJECT_LABELS[row.subject] ?? row.subject,
      },
      {
        name: "اليوم",
        selector: (row) => getDayNameAr(row.scheduledAt),
      },
      {
        name: "التاريخ",
        selector: (row) => formatDateArShort2DigitDay(row.scheduledAt),
      },
      {
        name: "الإجراءات",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="px-2 py-1.5"
              onClick={() => onEditLesson(row)}
            >
              <Icon icon="solar:pen-linear" className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="px-2 py-1.5 text-red-600"
              onClick={() => onDeleteLesson(row)}
            >
              <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
            </Button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [onDeleteLesson, onEditLesson],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">جدول الدروس</h2>
        <p className="text-subTitle mt-1 text-sm">
          عرض جميع الدروس المجدولة للطالب مع إمكانية تعديلها أو حذفها.
        </p>
      </div>

      <Table
        columns={columns}
        data={lessons}
        progressPending={isLoading}
        responsive
        persistTableHead
        noDataComponent={
          <div className="text-subTitle py-6 text-sm">
            لا توجد دروس مجدولة لهذا الطالب حاليًا.
          </div>
        }
      />
    </section>
  );
}

