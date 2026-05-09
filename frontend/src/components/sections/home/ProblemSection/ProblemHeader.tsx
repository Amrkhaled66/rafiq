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
        <span className="block">المشكلة مش في المذاكرة...</span>
        <span className="mt-2 block">
          المشكلة في <span className="text-brand-primary">التشتت.</span>
        </span>
      </h2>

      <p className="section-subTitle">
        كتير من الطلاب بيكونوا عايزين يذاكروا ولكن بيضيعوا <br />
        وقتهم بين التشتت و ان مفيش خطة واضحة ماشي عليها
      </p>
    </div>
  );
}
