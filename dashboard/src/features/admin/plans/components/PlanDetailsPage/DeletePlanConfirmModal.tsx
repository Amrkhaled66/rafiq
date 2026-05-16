import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

export default function DeletePlanConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="dashboard-card mx-auto max-w-lg space-y-5 rounded-3xl p-6 text-right">
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-bold">حذف الخطة</h2>
          <p className="text-subTitle text-sm">
            هل أنت متأكد من حذف هذه الخطة؟ سيتم حذف جميع مهامها نهائيًا.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-start">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700"
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
