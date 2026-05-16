import { useEffect, useState } from "react";

import type { MissedTaskRow } from "@/features/admin/missed-tasks/services/missedTasksService";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

export default function ResolveMissedTaskModal({
  isOpen,
  task,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  task: MissedTaskRow | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNote("");
      setError("");
    }
  }, [isOpen, task?.taskId]);

  function handleSubmit() {
    const trimmed = note.trim();

    if (!trimmed) {
      setError("ملاحظة الحل مطلوبة.");
      return;
    }

    setError("");
    onSubmit(trimmed);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="dashboard-card mx-auto max-w-xl space-y-5 rounded-3xl p-6 text-right">
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-bold">حل المهمة الفائتة</h2>
          <p className="text-subTitle text-sm">
            اكتب ملاحظة توضح ماذا حدث وكيف تم التعامل مع هذه المهمة.
          </p>
          {task ? (
            <p className="text-foreground text-sm font-medium">{task.taskName}</p>
          ) : null}
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-start text-sm font-medium text-foreground">
            ملاحظة الحل
          </span>
          <textarea
            dir="rtl"
            rows={5}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="اكتب سبب المشكلة أو ماذا حدث وكيف تم حلها"
            className={`w-full rounded-2xl border px-4 py-3 text-sm transition-colors focus:outline-none ${
              error
                ? "border-red-500 hover:bg-red-500/5"
                : "border-gray-300 hover:bg-brand-primary/5"
            }`}
          />
          {error ? <span className="text-sm text-red-500">{error}</span> : null}
        </label>

        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-start">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="button" isLoading={isSubmitting} onClick={handleSubmit}>
            تأكيد الحل
          </Button>
        </div>
      </div>
    </Modal>
  );
}
