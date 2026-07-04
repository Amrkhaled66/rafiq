import { Icon } from "@iconify/react";

const SeatsBadge = () => {
  return (
    <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[rgba(208,5,7,0.12)] bg-[rgba(208,5,7,0.06)] px-4 py-2 text-sm font-extrabold text-brand-primary">
      <Icon icon="solar:users-group-rounded-bold" className="text-base" />
      <span>دفعة محدودة</span>
    </div>
  );
};

export default SeatsBadge;