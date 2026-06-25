import InfoBadge from "@/src/components/shared/InfoBedge";

export default function ProblemHeader() {
  return (
    <div className="text-center space-y-4">
      <InfoBadge
        icon="streamline-ultimate:reward-stars-2"
        iconClassName="!size-5"
        text="ايه المشكلة اللي بتقابلك"
      />

      <h2 className="section-title">
        <span className="block">المشكلة مش فيك...</span>
        <span className="mt-2 block">
          المشكلة انك <span className="text-brand-primary">لوحدك.</span>
        </span>
      </h2>

      <p className="section-subTitle">
      مواد كتير، واجبات، مواعيد، ومش عارف تبدأ منين ولا تتابع تقدمك إزاي.
      </p>
    </div>
  );
}
