"use client";

import { Icon } from "@iconify/react";
import SeatsBadge  from "./SeatsBadge" ;
import SeatsStats from "./SeatsStats";
import SeatGrid from "./SeatGrid";
import SeatsAction from "./SeatsAction";
import FloatingIcon from "./FloatingIcon";
import type { BatchSeatsData } from "./types";

const seatsData: BatchSeatsData = {
  total: 50,
  reserved: 37,
};

const SeatsSection = () => {
  const available = Math.max(seatsData.total - seatsData.reserved, 0);

  return (
    <section
      id="limited-batch"
      dir="rtl"
      className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8"
    >
      <SectionBackground />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="relative text-center">
          <SeatsBadge />

          <FloatingIcon
            icon="solar:calendar-add-bold"
            className="right-[8%] top-20 hidden lg:flex"
          />

          <FloatingIcon
            icon="solar:user-rounded-bold"
            className="left-[8%] top-28 hidden lg:flex"
          />

          <MascotPlaceholder />

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            دفعة رفيق الجديدة
            <span className="mt-2 block text-brand-primary">
              قربت تكتمل
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-500 sm:text-base">
            عشان كل طالب ياخد متابعة حقيقية وخطة مناسبة ليه، بنفتح عدد محدود
            من الأماكن في كل دفعة.
          </p>
        </div>

        <div className="mt-10">
          <SeatsStats total={seatsData.total} reserved={seatsData.reserved} />
        </div>

        <div className="mt-7">
          <SeatGrid total={seatsData.total} reserved={seatsData.reserved} />
        </div>

        <div className="mt-8">
          {/* <SeatsAction available={available} /> */}
        </div>
      </div>
    </section>
  );
};

export default SeatsSection;

const SectionBackground = () => (
  <>
    <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[rgba(208,5,7,0.06)] blur-3xl" />
    <div className="pointer-events-none absolute left-0 bottom-0 h-[420px] w-[420px] rounded-full bg-[rgba(208,5,7,0.05)] blur-3xl" />

    <div className="pointer-events-none absolute right-[-120px] top-20 h-72 w-72 rounded-full border border-[rgba(208,5,7,0.08)]" />
    <div className="pointer-events-none absolute left-[-140px] top-52 h-80 w-80 rounded-full border border-[rgba(208,5,7,0.08)]" />
  </>
);

const MascotPlaceholder = () => (
  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] border border-[rgba(208,5,7,0.12)] bg-white shadow-[0_18px_50px_rgba(208,5,7,0.12)] sm:h-24 sm:w-24">
    <Icon
      icon="solar:notebook-bookmark-bold"
      className="text-4xl text-brand-primary sm:text-5xl"
    />
  </div>
);