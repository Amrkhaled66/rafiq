import { useState } from "react";
import type { MissedLessonRow } from "@/features/admin/missed-lessons/services/missedLessonsService";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

export default function ResolveMissedLessonModal({
  lesson,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  lesson: MissedLessonRow | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const value = note.trim();
    if (!value) {
      setError("ملاحظة المتابعة مطلوبة.");
      return;
    }
    onSubmit(value);
  }

  return (
    <Modal isOpen={Boolean(lesson)} onClose={onClose}>
      <div className="dashboard-card mx-auto max-w-xl space-y-5 rounded-3xl p-6 text-right">
        <div>
          <h2 className="text-foreground text-2xl font-bold">
            متابعة الحصة الفائتة
          </h2>
          <p className="text-subTitle mt-2 text-sm">
            سجل سبب عدم المشاهدة وما تم الاتفاق عليه مع الطالب.
          </p>
          {lesson ? (
            <p className="text-foreground mt-2 text-sm font-medium">
              {lesson.lessonName}
            </p>
          ) : null}
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-foreground text-sm font-medium">
            ملاحظة المتابعة
          </span>
          <textarea
            dir="rtl"
            rows={5}
            maxLength={1000}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none ${error ? "border-red-500" : "border-gray-300"}`}
            placeholder="اكتب تفاصيل المتابعة"
          />
          {error ? <span className="text-sm text-red-500">{error}</span> : null}
        </label>
        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-start">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="button" isLoading={isSubmitting} onClick={submit}>
            تأكيد المتابعة
          </Button>
        </div>
      </div>
    </Modal>
  );
}
