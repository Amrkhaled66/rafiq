"use client";

import { Icon } from "@iconify/react";
import { CONTACT } from "@/src/data/const";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

const steps: Step[] = [
  {
    id: 1,
    title: "تأكيد الاشتراك",
    description: "سيتم مراجعة الدفع وتأكيد اشتراكك.",
    icon: "solar:shield-check-bold",
  },
  {
    id: 2,
    title: "إرسال بيانات الدخول",
    description: "سنرسل لك الإيميل وكلمة المرور للدخول إلى التطبيق.",
    icon: "solar:letter-bold",
  },
  {
    id: 3,
    title: "تحديد موعد الجلسة الأولى",
    description: "سيتواصل معك فريقنا لتحديد موعد أول جلسة.",
    icon: "solar:calendar-mark-bold",
  },
];

const PaymentSuccessPage = () => {
  return (
    <section
      dir="rtl"
      className="min-h-screen bg-[#fffafa] px-3 py-6 text-[#1f102f] sm:px-5 sm:py-8 lg:px-8 lg:py-12"
    >
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[24px] border border-[#f1dddd] bg-white px-4 py-8 shadow-[0_18px_60px_rgba(31,16,47,0.08)] sm:rounded-[28px] sm:px-6 sm:py-10 lg:rounded-[32px] lg:px-16 lg:py-12">
          <div className="pointer-events-none absolute left-[-60px] top-[-60px] h-44 w-44 rounded-full bg-[#d00507]/5 blur-3xl sm:h-56 sm:w-56" />
          <div className="pointer-events-none absolute right-[-70px] top-20 h-44 w-44 rounded-full bg-green-400/10 blur-3xl sm:h-56 sm:w-56" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-green-500 bg-white text-green-600 shadow-[0_12px_35px_rgba(34,197,94,0.18)] sm:h-18 sm:w-18 lg:h-20 lg:w-20">
                <Icon
                  icon="solar:check-circle-bold"
                  className="text-4xl sm:text-5xl"
                />
              </div>
            </div>

            <h2 className="text-2xl font-black leading-tight sm:text-4xl lg:text-5xl">
              تم استلام طلبك بنجاح
            </h2>

            <h3 className="mt-3 text-2xl font-black leading-tight text-[#d00507] sm:mt-4 sm:text-3xl lg:text-4xl">
              ما الخطوات التالية؟
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#1f102f]/65 sm:mt-5 sm:text-base sm:leading-8 lg:text-lg">
              تم استلام الدفع بنجاح، وسيبدأ فريق رفيق في تنفيذ طلبك ومتابعة
              خطوات تفعيل الاشتراك.
            </p>

            {/* Steps */}
            <div className="mt-8 rounded-[22px] border border-[#f1dddd] bg-white p-4 sm:mt-10 sm:rounded-[28px] sm:p-6 lg:p-8">
              <div className="relative grid gap-4 lg:grid-cols-3 lg:gap-8">
                <div className="absolute inset-x-[16%] top-6 hidden border-t border-dashed border-[#d7caca] lg:block" />

                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="relative rounded-2xl bg-[#fffafa] p-4 text-start sm:p-5 lg:bg-transparent lg:p-0 lg:text-center"
                  >
                    {index !== steps.length - 1 && (
                      <div className="absolute right-[35px] top-[76px] h-[calc(100%+16px)] border-r border-dashed border-[#e5caca] lg:hidden" />
                    )}

                    <div className="relative z-10 flex items-start gap-4 lg:flex-col lg:items-center lg:gap-0">
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#f0caca] bg-white text-base font-black text-[#d00507] sm:h-11 sm:w-11 lg:mb-5 lg:h-12 lg:w-12 lg:text-lg">
                          {step.id}
                        </div>

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d00507]/[0.07] text-[#d00507] sm:h-20 sm:w-20 lg:mb-5 lg:h-24 lg:w-24">
                          <Icon
                            icon={step.icon}
                            className="text-3xl sm:text-4xl lg:text-5xl"
                          />
                        </div>
                      </div>

                      <div className="min-w-0 pt-1 lg:pt-0">
                        <h4 className="text-lg font-black leading-7 text-[#1f102f] sm:text-xl">
                          {step.title}
                        </h4>

                        <p className="mt-2 text-sm leading-7 text-[#1f102f]/60 sm:max-w-md lg:mx-auto lg:mt-3 lg:max-w-[230px]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mx-auto mt-6 flex max-w-xl items-start justify-center gap-3 rounded-2xl bg-[#d00507]/[0.05] px-4 py-4 text-start text-sm font-semibold leading-7 text-[#1f102f]/70 sm:mt-8 sm:items-center sm:px-5 sm:text-center">
              <Icon
                icon="solar:star-circle-bold"
                className="mt-1 shrink-0 text-xl text-[#d00507] sm:mt-0"
              />
              <span>ستصلك جميع التحديثات على بريدك الإلكتروني.</span>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <a
                href={`https://wa.me/${CONTACT}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d00507] px-6 py-4 text-sm font-black text-white shadow-[0_16px_35px_rgba(208,5,7,0.25)] transition hover:-translate-y-0.5 hover:bg-[#b90406] sm:w-auto sm:min-w-[220px] sm:text-base"
              >
                <Icon icon="solar:headphones-round-bold" className="text-xl" />
                تواصل مع الدعم
              </a>

              <a
                href="/"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#eadada] bg-white px-6 py-4 text-sm font-black text-[#1f102f] transition hover:border-[#d00507]/40 hover:text-[#d00507] sm:w-auto sm:min-w-[220px] sm:text-base"
              >
                العودة للرئيسية
                <Icon icon="solar:arrow-left-linear" className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessPage;