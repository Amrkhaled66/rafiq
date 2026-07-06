"use client";
import Image from "next/image";
import { Icon } from "@iconify/react";
import calenderImg from "@/src/assets/calender-icon3.png";

const batchData = {
  totalSeats: 100,
  reservedSeats: 70,
  batchName: "الدفعة الأولى",
};

const LimitedBatchBar = () => {
  const availableProgress = Math.round(
    (batchData.reservedSeats / batchData.totalSeats) * 100
  );

  return (
    <section dir="rtl" className="relative bg-white py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[30px] border border-slate-100 bg-white px-5 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:px-7 lg:px-8">
          <BackgroundDecor />

          <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[1.5fr_1.5fr_1fr]">
            <BatchInfo />

            <SeatsProgress
              totalSeats={batchData.totalSeats}
              reservedSeats={batchData.reservedSeats}
              availableSeats={batchData.totalSeats - batchData.reservedSeats}
              progress={availableProgress}
            />

            <BatchAction />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedBatchBar;

const BatchInfo = () => {
  return (
    <div className="flex items-center gap-6">
      <div className="relative hidden h-24 w-24 shrink-0 sm:block lg:h-28 lg:w-28">
        <Image
          src={calenderImg}
          alt="دفعة رفيق"
          fill
          className="object-contain drop-shadow-[0_18px_30px_rgba(208,5,7,0.16)]"
          priority
        />
      </div>

      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(208,5,7,0.12)] bg-[rgba(208,5,7,0.04)] px-4 py-2 text-xs font-extrabold text-brand-primary sm:text-sm">
          <Icon icon="solar:target-bold" className="text-base" />
          <span>{batchData.batchName}</span>
        </div>

        <h3 className="mt-3 text-xl font-black text-slate-950 sm:text-2xl">
          المقاعد محدودة 😌
        </h3>

        <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
          سجل الآن واضمن مكانك في الدفعة الجديدة.
        </p>
      </div>
    </div>
  );
};

const SeatsProgress = ({
  totalSeats,
  reservedSeats,
  availableSeats,
  progress,
}: {
  totalSeats: number;
  reservedSeats: number;
  availableSeats: number;
  progress: number;
}) => {
  return (
    <div className="border-y border-slate-100 py-5 lg:border-x lg:border-y-0 lg:px-8">
      <div className="mb-3 flex items-center justify-between text-sm font-bold text-slate-600">
        <span>
          <strong className="text-brand-primary">{availableSeats}</strong> متاح
        </span>

        <span>
          إجمالي <strong className="text-slate-950">{totalSeats}</strong>
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-primary shadow-[0_8px_18px_rgba(208,5,7,0.25)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(208,5,7,0.06)] text-brand-primary">
          <Icon icon="solar:users-group-rounded-bold" className="text-base" />
        </span>

        <span>
          <strong className="text-brand-primary">{reservedSeats}</strong> طالب
          سجلوا فعلاً
        </span>
      </div>
    </div>
  );
};

const BatchAction = () => {
  return (
    <div className="flex flex-col items-center gap-3 lg:items-stretch">
          <a
              href="#pricing"
        type="button"
        className="group flex w-full items-center justify-center gap-3 rounded-full bg-brand-primary px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(208,5,7,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(208,5,7,0.32)] active:translate-y-0"
      >
        <span>احجز مكانك حالاً</span>

        <Icon
          icon="solar:arrow-left-linear"
          className="text-lg transition duration-300 group-hover:-translate-x-1"
        />
      </a>

      {/* <p className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <Icon icon="solar:shield-check-bold" className="text-base text-brand-primary" />
        <span>مكانك محفوظ وآمن</span>
      </p> */}
    </div>
  );
};

const BackgroundDecor = () => {
  return (
    <>
      {/* <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[rgba(208,5,7,0.035)] blur-3xl" />

      <div className="pointer-events-none absolute left-6 top-5 hidden grid-cols-6 gap-1 opacity-15 sm:grid">
        {Array.from({ length: 36 }).map((_, index) => (
          <span
            key={index}
            className="h-1 w-1 rounded-full bg-brand-primary"
          />
        ))}
      </div> */}
    </>
  );
};