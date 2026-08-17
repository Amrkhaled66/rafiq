import { useState } from "react";

import type { SubscriptionRow } from "@/features/admin/subscriptions/services/subscriptionService";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";

type CancelSubscriptionModalProps = {
  isOpen: boolean;
  subscription: SubscriptionRow | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

export default function CancelSubscriptionModal({
  isOpen,
  subscription,
  isSubmitting = false,
  onClose,
  onSubmit,
}: CancelSubscriptionModalProps) {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="dashboard-card mx-auto max-w-xl space-y-5 rounded-3xl p-6 text-right md:p-8">
        <div>
          <h2 className="text-foreground text-2xl font-bold">
            إلغاء الاشتراك
          </h2>
          <p className="text-subTitle mt-2 text-sm">
            سيتم حذف الحصص المستقبلية غير المستخدمة فقط، مع الحفاظ على سجل
            الحصص السابقة والمشاهدة والمتابعة.
          </p>
        </div>

        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {subscription ? (
            <p>
              الطالب: {subscription.studentName} - الباقة:{" "}
              {subscription.packageName}
            </p>
          ) : null}
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-foreground text-sm font-medium">
            سبب الإلغاء
          </span>
          <textarea
            dir="rtl"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="border-card-border min-h-28 rounded-2xl border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-brand-primary"
            placeholder="اكتب سبب الإلغاء"
          />
        </label>

        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-start">
          <Button type="button" variant="outline" onClick={onClose}>
            تراجع
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isSubmitting}
            disabled={!trimmedReason}
            onClick={() => onSubmit(trimmedReason)}
          >
            تأكيد الإلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
}
