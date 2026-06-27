import { Icon } from "@iconify/react";
import Image from "next/image";
import InfoBadge from "@/src/components/shared/InfoBedge";
import ctaAvatar from "@/src/assets/cta-avatr.png";
import LeadModalTrigger from "@/src/components/shared/LeadModalTrigger";

export default function CTASection() {
  return (
    <section className="section relative overflow-hidden">
      <div className="relative z-10 -translate-y-6 sm:-translate-y-10 lg:-translate-y-12">
        <div className="relative flex flex-col items-center justify-center">
          <div className="pointer-events-none absolute inset-x-0 -top-4 z-0 h-24 sm:-top-6 sm:h-28">
            <Icon
              icon="iconoir:spark-solid"
              className="absolute right-[calc(50%-5.5rem)] -bottom-8 size-4 text-brand-primary opacity-90 sm:right-[calc(50%-7.5rem)] sm:-bottom-12 sm:size-6"
            />
            <Icon icon="" width="24" height="24" />
            <Icon
              icon="iconoir:spark-solid"
              className="absolute left-[calc(50%-5.75rem)] -bottom-8 size-4 -scale-x-100 text-brand-primary sm:left-[calc(50%-8rem)] sm:-bottom-12 sm:size-5"
            />
            <span className="absolute right-[calc(30%-3.75rem)] -bottom-1 size-1.5 rounded-full bg-brand-primary sm:right-[calc(40%-5.5rem)] sm:-bottom-2 sm:size-2" />
            <span className="absolute left-[calc(30%-3.75rem)] -bottom-2 size-1.5 rounded-full bg-brand-primary sm:left-[calc(40%-5.25rem)] sm:-bottom-4 sm:size-2" />
          </div>

          <div className="z-20 flex size-40 translate-y-10 items-end justify-center sm:h-44 sm:w-56 sm:translate-y-12">
            <Image
              src={ctaAvatar}
              alt="صورة الكوتش"
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="relative w-full overflow-hidden rounded-4xl bg-[#E63F3F] px-4 pb-7 pt-12 text-center text-white   sm:rounded-4xl sm:px-8 sm:pb-10 sm:pt-18">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-16 size-44 rounded-full bg-white/12 blur-[1px] sm:-left-14 sm:-top-12 sm:size-60" />
              <div className="absolute -right-24 bottom-0 size-44 rounded-full bg-white/10 blur-[1px] sm:-right-14 sm:size-60" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              <InfoBadge
                icon="streamline-ultimate:reward-stars-2"
                iconClassName="!size-5"
                text="جاهز تبدأ؟"
                className="border-white/15 bg-white/12 text-white shadow-none [&_span]:text-white [&_svg]:text-white"
              />

              <div className="space-y-3">
                <h2 className="text-3xl font-bold leading-[1.45] text-white sm:text-[2.6rem]">
                  جاهز تبدأ بخطة واضحة؟
                </h2>
                <p className="mx-auto max-w-2xl text-sm leading-7 text-white/90 sm:text-lg sm:leading-8">
                  خليك جزء من رفيق، ونفهم وضعك ونجهز لك خطة مناسبة مع كوتش
                  يتابعك خطوة بخطوة.
                </p>
              </div>

              <LeadModalTrigger
                containerClassName="inline-flex"
                buttonClassName="inline-flex min-h-12 w-full max-w-[70%] items-center justify-center gap-3  rounded-full bg-white px-6 py-3 text-base font-bold text-brand-primary! shadow-[0_18px_40px_rgba(107,12,16,0.18)] hover:-translate-y-0.5 hover:bg-[#fff5f5]! sm:min-h-16 sm:w-auto min-w-xs sm:px-8 sm:text-lg"
              >
                <Icon
                  icon="solar:calendar-linear"
                  className="order-first size-6 shrink-0"
                />
                <span>خليك جزء من رفيق</span>
              </LeadModalTrigger>

              <ul className="hidden sm:flex items-center justify-center gap-3 text-xs  font-medium text-white sm:flex-row sm:flex-wrap sm:gap-6 sm:text-base">
                <li>
                  <span>خطة واضحة</span>
                </li>
                <span className="hidden size-1.5 rounded-full bg-white sm:block" />
                <li>
                  <span>متابعة من الأبليكشن</span>
                </li>
                <span className="hidden size-1.5 rounded-full bg-white sm:block" />
                <li>
                  <span>متابعة مع كوتش</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
