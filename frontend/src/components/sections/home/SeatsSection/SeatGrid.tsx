type SeatGridProps = {
  total: number;
  reserved: number;
};

const SeatGrid = ({ total, reserved }: SeatGridProps) => {
  const seats = Array.from({ length: total }, (_, index) => ({
    id: index + 1,
    isReserved: index < reserved,
  }));

  const available = Math.max(total - reserved, 0);

  return (
    <div className="mx-auto max-w-5xl rounded-[30px] border border-slate-100 bg-white px-5 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:px-8">
      <div className="text-center">
        <h3 className="text-sm font-extrabold text-slate-700 sm:text-base">
          توفر أماكن المتابعة — {total} مكان إجمالًا
        </h3>
      </div>

      <div className="mx-auto mt-7 grid max-w-3xl grid-cols-10 gap-2 sm:grid-cols-12 md:grid-cols-20">
        {seats.map((seat) => (
          <SeatDot key={seat.id} isReserved={seat.isReserved} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs font-bold text-slate-500 sm:text-sm">
        <LegendDot
          label={`محجوز (${reserved})`}
          className="bg-brand-primary"
        />

        <LegendDot
          label={`متاح (${available})`}
          className="border border-emerald-400 bg-white"
        />
      </div>
    </div>
  );
};

export default SeatGrid;

const SeatDot = ({ isReserved }: { isReserved: boolean }) => (
  <span
    className={[
      "h-4 w-4 rounded-[5px] transition duration-300 sm:h-5 sm:w-5",
      isReserved
        ? "bg-brand-primary shadow-[0_6px_14px_rgba(208,5,7,0.18)]"
        : "border border-emerald-400 bg-white",
    ].join(" ")}
  />
);

const LegendDot = ({
  label,
  className,
}: {
  label: string;
  className: string;
}) => (
  <span className="flex items-center gap-2">
    <span className={["h-3 w-3 rounded-[4px]", className].join(" ")} />
    <span>{label}</span>
  </span>
);