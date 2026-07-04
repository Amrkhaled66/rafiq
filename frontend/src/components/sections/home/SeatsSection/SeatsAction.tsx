import { Icon } from "@iconify/react";

type SeatsActionProps = {
  available: number;
};

const SeatsAction = ({ available }: SeatsActionProps) => {
  const isFull = available <= 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 rounded-[30px] border border-[rgba(208,5,7,0.1)] bg-[rgba(208,5,7,0.04)] px-5 py-6 sm:px-8 lg:flex-row">
      <div className="flex items-center gap-4 text-center lg:text-start">
        <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary shadow-[0_14px_40px_rgba(208,5,7,0.12)] sm:flex">
          <Icon icon="solar:bell-bing-bold" className="text-3xl" />
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-950 sm:text-2xl">
            {isFull ? "الأماكن اكتملت حاليًا" : "الأماكن مش هتفضل مفتوحة كتير"}
          </h3>

          <p className="mt-1 text-sm font-medium text-slate-500 sm:text-base">
            {isFull
              ? "سيب بياناتك وسنبلغك أول ما نفتح دفعة جديدة."
              : `متبقي ${available} مكان فقط. احجز قبل ما الدفعة تكتمل.`}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          className="group flex items-center justify-center gap-3 rounded-full bg-brand-primary px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(208,5,7,0.26)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(208,5,7,0.34)]"
        >
          <span>{isFull ? "انضم لقائمة الانتظار" : "احجز مكانك في دفعة رفيق"}</span>

          <Icon
            icon="solar:arrow-left-linear"
            className="text-lg transition duration-300 group-hover:-translate-x-1"
          />
        </button>

        {!isFull && (
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-full border border-[rgba(208,5,7,0.22)] bg-white px-7 py-3.5 text-sm font-extrabold text-brand-primary transition duration-300 hover:bg-[rgba(208,5,7,0.05)]"
          >
            <Icon icon="solar:user-plus-rounded-bold" className="text-lg" />
            <span>انضم لقائمة الانتظار</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SeatsAction;