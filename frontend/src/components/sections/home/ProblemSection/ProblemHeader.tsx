import InfoBadge from "@/src/components/shared/InfoBedge";

export default function ProblemHeader() {
  return (
    <div className="text-center">
      <InfoBadge
        icon="streamline-ultimate:reward-stars-2"
        iconClassName="!size-5"
        text="ايه المشكلة اللي بتقابلك"
      />

      <h2 className="mt-6 text-[2.2rem] font-bold leading-[1.45] tracking-[-0.03em] text-slate-950 sm:text-5xl">
        <span className="block">المشكلة مش في المذاكرة...</span>
        <span className="mt-2 block">
          المشكلة في <span className="text-(--brand-primary)">التشتت.</span>
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
        كتير من الطلاب بيكونوا عايزين يذاكروا ولكن بيضيعوا <br />
        وقتهم بين التشتت و ان مفيش خطة واضحة ماشي عليها
      </p>
    </div>
  );
}
