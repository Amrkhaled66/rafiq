"use client";

import { Icon } from "@iconify/react";

const summaryItems = [
  {
    label: "المنتج",
    value: "اشتراك رفيق",
    icon: "solar:box-bold",
  },
  {
    label: "مدة الاشتراك",
    value: "شهر واحد",
    icon: "solar:calendar-bold",
  },
  {
    label: "السعر",
    value: "199 جنيه",
    icon: "solar:tag-price-bold",
    highlight: true,
  },
  {
    label: "طريقة الدفع",
    value: "-",
    icon: "solar:card-bold",
  },
];

const CheckoutSummary = () => {
  return (
    <aside className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.07)] sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-950">ملخص الطلب</h2>

        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(208,5,7,0.07)] text-brand-primary">
          <Icon icon="solar:bill-list-bold" className="text-xl" />
        </span>
      </div>

      <div className="mt-8 text-center">
        <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[rgba(208,5,7,0.06)]">
          <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-[rgba(208,5,7,0.12)] bg-white text-brand-primary shadow-[0_18px_40px_rgba(208,5,7,0.12)]">
            <Icon icon="solar:gallery-bold" className="text-4xl" />
          </div>
        </div>

        <h3 className="mt-5 text-2xl font-black text-brand-primary">
          اشتراك رفيق
        </h3>

        <p className="mt-1 text-sm font-semibold text-slate-500">
          باقة الطالب
        </p>
      </div>

      <div className="mt-8 divide-y divide-slate-100">
        {summaryItems.map((item) => (
          <SummaryItem key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[rgba(208,5,7,0.14)] bg-[rgba(208,5,7,0.045)] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary">
            <Icon icon="solar:shield-check-bold" className="text-xl" />
          </span>

          <div>
            <p className="text-sm font-black text-brand-primary">
              اشتراكك يبدأ بعد تأكيد الدفع
            </p>
            <p className="mt-1 text-xs font-medium leading-6 text-slate-500">
              هنوصلك بيانات الدخول والمتابعة على واتساب.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CheckoutSummary;

const SummaryItem = ({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(208,5,7,0.06)] text-brand-primary">
          <Icon icon={icon} className="text-xl" />
        </span>

        <span className="text-sm font-semibold text-slate-500">{label}</span>
      </div>

      <span
        className={[
          "text-sm font-black",
          highlight ? "text-brand-primary" : "text-slate-950",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
};