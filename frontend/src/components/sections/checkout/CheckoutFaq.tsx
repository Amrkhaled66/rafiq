"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

const faqs = [
  {
    question: "إيه اللي بيحصل بعد الدفع؟",
    answer:
      "فريق رفيق بيراجع عملية التحويل، وهيتواصل معاك في أقل من 12 ساعة لتأكيد الدفع وتحديد معاد جلسة البداية.",
    icon: "solar:shield-check-bold",
  },
  {
    question: "إزاي بنبدأ أول خطوة بعد الدفع؟",
    answer:
      "بنحدد معاد جلسة البداية عشان نجهز أول خطة تمشي عليها، وبتستلم حسابك عشان تدخل على الأبلكيشن وتتابع خططك من هناك.",
    icon: "solar:calendar-mark-bold",
  },
  {
    question: "إيه اللي هيحصل لو ملتزمتش بالخطة ولا بالمذاكرة؟",
    answer:
      "لو مفيش التزام بالخطة أو المتابعة، الفلوس هترجع لك، ومش هتكون جزء من مجتمع رفيق.",
    icon: "solar:danger-triangle-bold",
  },
  {
    question: "إيه اللي هيحصل لو محسّتش بأي تغيير؟",
    answer:
      "لو التزمت بالخطة ومتابعة رفيق ومحسّتش بأي فرق حقيقي في مذاكرتك، هنرجع لك فلوسك بالكامل.",
    icon: "solar:refresh-circle-bold",
  },
];

const CheckoutFaq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="mt-6 rounded-[28px] h-fit border border-slate-100 bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950">
            الأسئلة الشائعة
          </h2>
          <div className="mt-2 h-1 w-12 rounded-full bg-brand-primary" />
        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(208,5,7,0.07)] text-brand-primary">
          <Icon icon="solar:question-circle-bold" className="text-xl" />
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-1">
        {faqs.map((faq, index) => (
          <FaqItem
            key={faq.question}
            faq={faq}
            isOpen={activeIndex === index}
            onClick={() =>
              setActiveIndex(activeIndex === index ? null : index)
            }
          />
        ))}
      </div>

      {/* <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
        <Icon icon="logos:whatsapp-icon" className="text-lg" />
        <span>لو محتاج مساعدة، تواصل معانا على واتساب.</span>
      </div> */}
    </section>
  );
};

export default CheckoutFaq;

const FaqItem = ({
  faq,
  isOpen,
  onClick,
}: {
  faq: {
    question: string;
    answer: string;
    icon: string;
  };
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-100 bg-white p-4 text-start transition duration-300 hover:border-[rgba(208,5,7,0.18)] hover:shadow-[0_14px_35px_rgba(15,23,42,0.06)]"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(208,5,7,0.07)] text-brand-primary">
          <Icon icon={faq.icon} className="text-xl" />
        </span>

        <div className="flex-1">
          <p className="text-sm font-black text-slate-950">{faq.question}</p>
        </div>

        <Icon
          icon="solar:alt-arrow-down-linear"
          className={[
            "text-xl text-slate-500 transition duration-300",
            isOpen ? "rotate-180 text-brand-primary" : "",
          ].join(" ")}
        />
      </div>

     
        <p className={` border-t border-slate-100  overflow-hidden text-sm font-medium leading-7 text-slate-500 transition-all duration-300" ${isOpen ? "max-h-200 pt-3 mt-3 " : "max-h-0"}`}>
          {faq.answer}
        </p>
      
    </button>
  );
};