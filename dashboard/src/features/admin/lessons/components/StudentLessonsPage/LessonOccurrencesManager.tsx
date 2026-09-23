import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import type { TableColumn } from "react-data-table-component";

import {
  useDeleteStudentLessonOccurrenceMutation,
  useStudentLessonOccurrencesQuery,
  useUpdateStudentLessonOccurrenceMutation,
} from "@/features/admin/lessons/queries/lessonQueries";
import type { LessonOccurrence } from "@/features/admin/lessons/services/lessonService";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";
import Table from "@/shared/components/Table";
import {
  SCHOOL_SUBJECT_LABELS,
  SCHOOL_SUBJECT_OPTIONS,
} from "@/shared/const/subjects";
import { LESSON_WEEKDAY_LABELS } from "@/shared/const/weekdays";
import { appToast } from "@/shared/lib/toast";
import { showApiErrorToast } from "@/shared/utils/showApiErrorToast";

type LessonOccurrencesManagerProps = {
  studentId: number;
};

const OCCURRENCE_STATUS_LABELS: Record<LessonOccurrence["status"], string> = {
  scheduled: "مجدولة",
  watched_on_time: "تمت في موعدها",
  missed: "فائتة",
  watched_late: "تمت متأخرة",
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isWatchedOccurrence(occurrence: LessonOccurrence) {
  return (
    occurrence.status === "watched_on_time" ||
    occurrence.status === "watched_late"
  );
}

export default function LessonOccurrencesManager({
  studentId,
}: LessonOccurrencesManagerProps) {
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState(formatDate(today));
  const [to, setTo] = useState(formatDate(addDays(today, 60)));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nextDate, setNextDate] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [occurrenceToDelete, setOccurrenceToDelete] =
    useState<LessonOccurrence | null>(null);

  const occurrencesQuery = useStudentLessonOccurrencesQuery(studentId, {
    from,
    to,
  });
  const updateOccurrenceMutation =
    useUpdateStudentLessonOccurrenceMutation(studentId);
  const deleteOccurrenceMutation =
    useDeleteStudentLessonOccurrenceMutation(studentId);

  const filteredOccurrences = useMemo(() => {
    const occurrences = occurrencesQuery.data ?? [];

    if (selectedSubject === "all") {
      return occurrences;
    }

    return occurrences.filter(
      (occurrence) => occurrence.subject === selectedSubject,
    );
  }, [occurrencesQuery.data, selectedSubject]);

  function startEdit(occurrence: LessonOccurrence) {
    setEditingId(occurrence.id);
    setNextDate(occurrence.scheduledForDate);
    setOccurrenceToDelete(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setNextDate("");
  }

  function submitEdit(occurrence: LessonOccurrence) {
    if (!nextDate || nextDate === occurrence.scheduledForDate) {
      cancelEdit();
      return;
    }

    updateOccurrenceMutation.mutate(
      { occurrenceId: occurrence.id, scheduledForDate: nextDate },
      {
        onSuccess: () => {
          cancelEdit();
          appToast.success("تم تغيير موعد الحصة بنجاح.");
        },
        onError: (error) => {
          showApiErrorToast(error, "تعذر تغيير موعد الحصة.");
        },
      },
    );
  }

  function confirmDelete() {
    if (!occurrenceToDelete) {
      return;
    }

    deleteOccurrenceMutation.mutate(occurrenceToDelete.id, {
      onSuccess: () => {
        setOccurrenceToDelete(null);
        appToast.success("تم حذف الحصة من هذا اليوم بنجاح.");
      },
      onError: (error) => {
        showApiErrorToast(error, "تعذر حذف الحصة من هذا اليوم.");
      },
    });
  }

  const columns = useMemo<TableColumn<LessonOccurrence>[]>(
    () => [
      {
        name: "الدرس",
        selector: (row) => row.lessonName,
        grow: 1.3,
      },
      {
        name: "المادة",
        selector: (row) => SCHOOL_SUBJECT_LABELS[row.subject] ?? row.subject,
      },
      {
        name: "التاريخ",
        cell: (row) =>
          editingId === row.id ? (
            <input
              type="date"
              value={nextDate}
              onChange={(event) => setNextDate(event.target.value)}
              className="border-card-border rounded-xl border bg-white px-2 py-2 text-sm outline-none focus:border-brand-primary"
            />
          ) : (
            row.scheduledForDate
          ),
      },
      {
        name: "اليوم",
        selector: (row) =>
          LESSON_WEEKDAY_LABELS[row.scheduledWeekday] ?? row.scheduledWeekday,
      },
      {
        name: "الحالة",
        selector: (row) => OCCURRENCE_STATUS_LABELS[row.status] ?? row.status,
      },
      {
        name: "الإجراءات",
        cell: (row) => {
          const isWatched = isWatchedOccurrence(row);
          const isEditing = editingId === row.id;

          if (isEditing) {
            return (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="px-2 py-1.5"
                  isLoading={updateOccurrenceMutation.isPending}
                  onClick={() => submitEdit(row)}
                >
                  <Icon icon="solar:check-circle-linear" className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="px-2 py-1.5"
                  disabled={updateOccurrenceMutation.isPending}
                  onClick={cancelEdit}
                >
                  <Icon icon="solar:close-circle-linear" className="size-4" />
                </Button>
              </div>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="px-2 py-1.5"
                disabled={isWatched || deleteOccurrenceMutation.isPending}
                onClick={() => startEdit(row)}
              >
                <Icon icon="solar:calendar-mark-linear" className="size-4" />
              </Button>
              <Button
                variant="ghost"
                className="px-2 py-1.5 text-red-600"
                disabled={isWatched || deleteOccurrenceMutation.isPending}
                onClick={() => {
                  cancelEdit();
                  setOccurrenceToDelete(row);
                }}
              >
                <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
              </Button>
            </div>
          );
        },
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [
      deleteOccurrenceMutation.isPending,
      editingId,
      nextDate,
      updateOccurrenceMutation.isPending,
    ],
  );

  return (
    <section className="dashboard-card space-y-5 text-right">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <FormInput
          label="من تاريخ"
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
        />
        <FormInput
          label="إلى تاريخ"
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => void occurrencesQuery.refetch()}
        >
          تحديث
        </Button>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant={selectedSubject === "all" ? "primary" : "outline"}
          className="px-3 py-1.5 text-xs"
          onClick={() => setSelectedSubject("all")}
        >
          كل المواد
        </Button>
        {SCHOOL_SUBJECT_OPTIONS.map((subject) => (
          <Button
            key={subject.value}
            type="button"
            variant={selectedSubject === subject.value ? "primary" : "outline"}
            className="px-3 py-1.5 text-xs"
            onClick={() => setSelectedSubject(subject.value)}
          >
            {subject.label}
          </Button>
        ))}
      </div>

      {occurrenceToDelete ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">
            هل تريد حذف حصة "{occurrenceToDelete.lessonName}" يوم{" "}
            {occurrenceToDelete.scheduledForDate}؟
          </p>
          <div className="mt-3 flex flex-col-reverse gap-2 md:flex-row md:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={deleteOccurrenceMutation.isPending}
              onClick={() => setOccurrenceToDelete(null)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={deleteOccurrenceMutation.isPending}
              onClick={confirmDelete}
            >
              حذف الحصة
            </Button>
          </div>
        </div>
      ) : null}

      <Table
        columns={columns}
        data={filteredOccurrences}
        progressPending={occurrencesQuery.isFetching}
        responsive
        persistTableHead
        noDataComponent={
          <div className="text-subTitle py-6 text-sm">
            لا توجد حصص في هذه الفترة.
          </div>
        }
      />
    </section>
  );
}
