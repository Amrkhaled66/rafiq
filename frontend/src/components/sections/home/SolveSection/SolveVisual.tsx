import clsx from "clsx";

import sessionImage from "@/src/assets/session.png";
import targetImage from "@/src/assets/target-icon2.png";
import calendarImage from "@/src/assets/calender-icon2.png";
import coachImage from "@/src/assets/coach.png";
import mobileApp from "@/src/assets/mobile-app.png";
import SolveCard, { SolveCardAccent, SolveCardItem } from "./SolveCard";
const accents = {
  red: {
    title: "text-brand-primary",
    pill: "bg-[rgba(208,5,7,0.10)] text-brand-primary",
    blob: "bg-[rgba(208,5,7,0.10)]",
    border: "border-[rgba(208,5,7,0.10)]",
  },
  redStrong: {
    title: "text-brand-primary",
    pill: "bg-[rgba(208,5,7,0.12)] text-brand-primary",
    blob: "bg-[rgba(208,5,7,0.12)]",
    border: "border-[rgba(208,5,7,0.18)]",
    shadow: "shadow-[0_26px_70px_rgba(208,5,7,0.14)]",
  },
  purple: {
    title: "text-[#7c3aed]",
    pill: "bg-[rgba(124,58,237,0.12)] text-[#7c3aed]",
    blob: "bg-[rgba(124,58,237,0.10)]",
    border: "border-[rgba(124,58,237,0.10)]",
  },
  orange: {
    title: "text-[#ea580c]",
    pill: "bg-[rgba(249,115,22,0.12)] text-[#ea580c]",
    blob: "bg-[rgba(249,115,22,0.12)]",
    border: "border-[rgba(249,115,22,0.10)]",
  },
  green: {
    title: "text-[#169c52]",
    pill: "bg-[rgba(22,163,74,0.12)] text-[#169c52]",
    blob: "bg-[rgba(34,197,94,0.12)]",
    border: "border-[rgba(22,163,74,0.12)]",
  },
} satisfies Record<string, SolveCardAccent>;

const cards: SolveCardItem[] = [
  {
    step: "01",
    title: "جلسة بداية",
    subtitle: "بنبدأ بجلسة نفهم فيها أهدافك، وقتك، وتحدياتك في المذاكرة.",
    accent: accents.red,
    image: sessionImage,
    imageAlt: "أيقونة جلسة البداية",
  },
  {
    step: "02",
    title: "نعرف إنت واقف فين",
    subtitle: "بنحدد وضعك الحالي، مستواك، وإيه أكتر حاجات محتاجة تنظيم وتركيز.",
    accent: accents.purple,
    image: targetImage,
    imageAlt: "أيقونة تحديد الهدف",
  },
  {
    step: "03",
    title: "نجهز الخطة",
    subtitle: "بنجهز لك خطة واضحة مناسبة لوقتك، مستواك، وهدفك.",
    accent: accents.orange,
    image: calendarImage,
    imageAlt: "أيقونة تجهيز الخطة",
  },
  {
    step: "04",
    title: "كوتش يتابع معاك",
    subtitle:
      "في كوتش بيتابع تنفيذ الخطة معاك، يساعدك تكمل، ويظبط الطريق لو محتاج.",
    accent: accents.redStrong,
    image: coachImage,
    imageAlt: "صورة الكوتش",
    cardClassName:
      "!bg-brand-primary-soft/20 md:col-span-1 lg:col-span-1 xl:col-span-1",
    sparkle: true,
  },
  {
    step: "05",
    title: "الأبلكيشن يسهل التنفيذ",
    subtitle:
      "من الأبلكيشن تتابع الخطة، مهامك، مواعيدك، ونسبة تقدمك في مكان واحد.",
    accent: accents.green,
    image: mobileApp,
    imageClassName: "!w-39 !h-auto",
    imageAlt: "واجهة تطبيق رفيق",
    cardClassName: "md:col-span-2 lg:col-span-1",
  },
];

export default function SolveVisual() {
  return (
    <div dir="ltr" className="relative">
      <div
        className={clsx(
          "grid grid-cols-1 gap-6",
          "md:grid-cols-2",
          "xl:hidden",
        )}
      >
        {cards.map((card, index) => (
          <SolveCard
            key={card.step}
            {...card}
            cardClassName={clsx(
              "min-h-[210px]",
              card.cardClassName,
              index === 4 && "md:col-span-2!",
            )}
          />
        ))}
      </div>

      <div className="hidden space-y-7 xl:block">
        <div className="relative">
          <div className="grid grid-cols-3 gap-12">
            {cards.slice(0, 3).map((card) => (
              <SolveCard
                key={card.step}
                {...card}
                cardClassName="min-h-[210px]"
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-7">
          {cards.slice(3).map((card) => (
            <SolveCard
              key={card.step}
              {...card}
              cardClassName={clsx("min-h-[215px]", card.cardClassName)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
