import InfoBadge from "@/src/components/shared/InfoBedge";

export default function SolveHeader() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 text-center">
      <InfoBadge
        icon="solar:magic-stick-3-bold-duotone"
        iconClassName="!size-5"
        text="إزاي رفيق بيحل المشكلة؟"
      />

      <h2 className="section-title max-w-xl lg:max-w-none lg:text-nowrap">
        <span>من أول جلسة...</span>
        لحد <span className="text-brand-primary">تنفيذ الخطة</span> يوم بيوم
      </h2>

      <p className="section-subTitle max-w-sm">
      رفيق هيفهم وضعك، يرتب أولوياتك، ويحول المذاكرة لخطة بسيطة تقدر تمشي عليها بوضوح.
      </p>
    </div>
  );
}
