import type { LessonWatchTarget } from "@/features/lessons/hooks/useLessonWatchConfirmation";
import { AppModal } from "@/shared/ui/app-modal";

export function LessonWatchConfirmationModal({
  target,
  isSubmitting,
  errorMessage,
  onConfirm,
  onClose,
}: {
  target: LessonWatchTarget | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const isWatching = target?.intent === "watch";

  return (
    <AppModal
      visible={Boolean(target)}
      title={isWatching ? "تأكيد مشاهدة الحصة" : "إلغاء مشاهدة الحصة"}
      message={
        isWatching
          ? `  متأكد أنك شوفت الحصة "${target?.lessonName ?? ""}"؟`
          : ` متأكد انك عايز تلغي المشاهدة "${target?.lessonName ?? ""}"؟`
      }
      actionLabel={isWatching ? "ايوة شوفتها" : "احذف المشاهدة"}
      secondaryActionLabel="رجوع"
      isActionLoading={isSubmitting}
      errorMessage={errorMessage}
      onAction={onConfirm}
      onSecondaryAction={onClose}
      onClose={onClose}
    />
  );
}
