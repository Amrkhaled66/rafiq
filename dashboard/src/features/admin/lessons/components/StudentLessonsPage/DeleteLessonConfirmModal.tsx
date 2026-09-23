import type { Lesson } from "@/features/admin/lessons/services/lessonService";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

type DeleteLessonConfirmModalProps = {
  lesson: Lesson | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export default function DeleteLessonConfirmModal({
  lesson,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteLessonConfirmModalProps) {
  return (
    <Modal isOpen={Boolean(lesson)} onClose={onClose}>
      <div className="dashboard-card mx-auto max-w-lg space-y-5 rounded-3xl p-6 text-right">
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-bold">حذف الدرس</h2>
          <p className="text-subTitle text-sm">
            هل أنت متأكد من حذف درس "{lesson?.name}"؟ سيتم حذف كل الحصص
            المرتبطة به وسجلات حل الحصص الفائتة نهائيًا.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            تأكيد الحذف
          </Button>
        </div>
      </div>
    </Modal>
  );
}
