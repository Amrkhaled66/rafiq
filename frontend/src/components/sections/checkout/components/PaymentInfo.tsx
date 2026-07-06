"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import type { PaymentMethod } from "../types";

type PaymentInfoProps = {
  selectedPayment: PaymentMethod["id"];
};

const PAYMENT_NUMBER = "01032321303";

const paymentInfoContent: Record<
  PaymentMethod["id"],
  {
    title: string;
    steps: string[];
  }
> = {
  instapay: {
    title: "تعليمات الدفع عبر Instapay",
    steps: [
      "حوّل على الرقم الموضح بالأسفل.",
      "تأكد من كتابة رقم الهاتف المستخدم في الاشتراك.",
      "بعد التحويل، ارفع صورة الإيصال لتأكيد الاشتراك.",
    ],
  },
  vodafone_cash: {
    title: "تعليمات الدفع عبر Vodafone Cash",
    steps: [
      "حوّل على الرقم الموضح بالأسفل.",
      "تأكد من أن التحويل تم من خلال المحفظة.",
      "بعد التحويل، ارفع صورة الإيصال لتأكيد الاشتراك.",
    ],
  },
};

const PaymentInfo = ({ selectedPayment }: PaymentInfoProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const info = paymentInfoContent[selectedPayment];

  const handleCopyNumber = async () => {
    await navigator.clipboard.writeText(PAYMENT_NUMBER);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-[rgba(208,5,7,0.12)] bg-[rgba(208,5,7,0.045)] p-4"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary shadow-sm">
          <Icon icon="solar:info-circle-bold" className="text-xl" />
        </span>

        <h4 className="text-sm font-bold text-slate-800">{info.title}</h4>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
        <div>
          <p className="text-xs font-medium text-slate-500">رقم التحويل</p>
          <p className="font-bold tracking-wide text-slate-900">
            {PAYMENT_NUMBER}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyNumber}
          className="flex items-center gap-1 rounded-xl bg-brand-primary px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
        >
          <Icon
            icon={isCopied ? "solar:check-circle-bold" : "solar:copy-bold"}
            className="text-base"
          />
          {isCopied ? "تم النسخ" : "نسخ"}
        </button>
      </div>

      <ul className="space-y-2 pr-5 text-sm leading-7 text-slate-600">
        {info.steps.map((step) => (
          <li key={step} className="list-disc">
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentInfo;