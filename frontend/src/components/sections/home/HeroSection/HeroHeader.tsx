import { Icon } from "@iconify/react";
import InfoBadge from "../../../shared/InfoBedge";
import Button from "@/src/components/shared/Button";
import AnimatedWord from "./AnimateWord";

export default function HeroHeader() {
  return (
    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
      <InfoBadge
        text="منصة تنظيم المذاكرة الأولى في مصر"
        icon="game-icons:graduate-cap"
      />

      <h1 className="text-[2.8rem] leading-[1.3] font-bold tracking-[-0.03em] text-black sm:text-[3.6rem] md:text-[4.6rem] lg:text-[4.6rem]">
        <span className="block">رفيقك من</span>

        <AnimatedWord />

        <span className="mt-1 block">
          إلى <span className="text-(--brand-primary)">تنظيم</span> مذاكرتك
        </span>
      </h1>

      <p className="mt-6 text-base font-medium text-black/62 sm:text-lg">
        خطط يومك، تابع مهامك، وخلي الكوتش <br />
        يساعدك توصّل لهدفك خطوة بخطوة
      </p>

      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
        <Button className="px-22 py-3 text-xl  rounded-2xl!" variant="primary">
          ابدأ الآن
        </Button>
      </div>

      <div className="absolute top-28 right-[19%] hidden text-(--brand-primary-muted) lg:block">
        <Icon icon="solar:star-fall-bold-duotone" className="h-7 w-7" />
      </div>
    </div>
  );
}
