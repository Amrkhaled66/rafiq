import InfoBadge from "@/src/components/shared/InfoBedge";
import ScrollRevealHeading from "@/src/components/shared/ScrollRevealHeading";

export default function SolveHeader() {
  return (
    <div dir="rtl" className="flex flex-col items-center text-center">
      <InfoBadge
        icon="solar:magic-stick-3-bold-duotone"
        iconClassName="!size-5"
        text="إزاي رفيق بيحل المشكلة؟"
      />

      <ScrollRevealHeading className="mt-4 max-w-xl lg:max-w-none lg:text-nowrap">
        <span>من أول جلسة...</span>{" "}
        لحد{" "}
        <span className="text-brand-primary">تنفيذ الخطة</span>{" "}
        يوم بيوم
      </ScrollRevealHeading>

      <p className="section-subTitle mt-4 max-w-sm">
        رفيق هيفهم وضعك، يرتب أولوياتك، ويحول المذاكرة لخطة بسيطة تقدر تمشي
        عليها بوضوح.
      </p>
    </div>
  );
}
