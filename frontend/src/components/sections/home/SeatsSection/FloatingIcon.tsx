import { Icon } from "@iconify/react";

type FloatingIconProps = {
  icon: string;
  className?: string;
};

const FloatingIcon = ({ icon, className = "" }: FloatingIconProps) => {
  return (
    <div
      className={[
        "absolute h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(208,5,7,0.1)] bg-white/90 text-brand-primary shadow-[0_18px_50px_rgba(208,5,7,0.12)] backdrop-blur",
        className,
      ].join(" ")}
    >
      <Icon icon={icon} className="text-3xl" />
    </div>
  );
};

export default FloatingIcon;