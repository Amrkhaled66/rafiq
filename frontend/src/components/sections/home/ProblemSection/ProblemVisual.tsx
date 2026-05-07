import Image from "next/image";
import ProblemCard from "./ProblemCard";
import studentConfusing from "@/src/assets/student-confusing.png";
import targetIcon from "@/src/assets/target-icon.png";
import questionIcon from "@/src/assets/question.png";
import calenderIcon from "@/src/assets/calender-icon.png";
import clockIcon from "@/src/assets/clock.png";
const problemCards = [
  {
    title: "مش عارف تبدأ منين",
    description: "كل يوم فيه حاجات كتير ومفيش أولويات واضحة",
    icon: targetIcon,
    iconType: "image",
    accentClassName: "bg-[rgba(208,5,7,0.08)] text-(--brand-primary)",
    positionClassName: "mr-0",
  },
  {
    title: "مواعيدك بتتلخبط",
    description: "حصص ومهام ومواعيد كتير وسهل تنسى حاجة",
    icon: "fe:calendar",
    iconType: "icon",
    accentClassName: "bg-[rgba(132,90,223,0.12)] text-[#7c3aed]",
    positionClassName: "ml-0",
  },
  {
    title: "مهامك مشتتة",
    description: "جزء في الشات وجزء في دماغك وجزء مكتوب في كذا مكان",
    icon: "solar:share-circle-bold-duotone",
    iconType: "icon",
    accentClassName: "bg-[rgba(251,146,60,0.14)] text-[#ea580c]",
    positionClassName: "mr-0",
  },
  {
    title: "مش شايف تقدمك",
    description: "حتى لما تخلص، مش دايمًا بتحس إنك بتتقدم",
    icon: "mage:chart-fill",
    iconType: "icon",
    accentClassName: "bg-[rgba(34,197,94,0.14)] text-[#16a34a]",
    positionClassName: "ml-0",
  },
];

export default function ProblemVisual() {
  return (
    <div className="flex lg:block flex-col-reverse overflow-hidden sm:drop-shadow-sm rounded-3xl px-8 bg-[linear-gradient(180deg,#fffdfd_0%,#fff6f6_56%,#ffffff_100%)] py-12 w-full sm:grid-cols-2 ">
      <div className="grid  sm:grid-cols-2 gap-6 lg:gap-8">
        {problemCards.map((card, i) => (
          <ProblemCard
            index={i}
            key={card.title}
            title={card.title}
            description={card.description}
            icon={card.icon}
            iconType={card.iconType}
            accentClassName={card.accentClassName}
            className={card.positionClassName}
          />
        ))}
      </div>
      <div className="mx-auto relative h-fit sm:-z-10  flex w-full max-w-[18rem] justify-center lg:absolute lg:inset-x-0 lg:-bottom-5 lg:mt-0 ">
        <div className="inset-x-10  overflow-hidden rounded-full bg-[radial-gradient(circle,rgba(208,5,7,0.26)_0%,rgba(208,5,7,0)_75%)] blur-2xl" />
        <div className="h-full overflow-hidden">
          <Image
            src={studentConfusing}
            alt="طالب محتار يحمل كتبه وجهازه اللوحي"
            className="relative translate-y-9 z-10 h-auto w-[18rem] object-contain sm:w-[20rem] lg:w-[24rem] xl:w-[18rem]"
          />
        </div>
        <Image
          src={questionIcon}
          alt="رمز سؤال"
          className="absolute top-6 -inset-e-9 -rotate-20 h-20 w-18"
        />
        <Image
          src={questionIcon}
          alt="رمز سؤال"
          className="absolute top-1/2 -translate-y-1/2 -inset-s-9 rotate-20 h-20 w-18"
        />
        <Image
          src={calenderIcon}
          alt="رمز تقويم"
          className="absolute top-10 -translate-y-1/2 -inset-s-9 rotate-10 size-22"
        />
        <Image
          src={clockIcon}
          alt="رمز ساعة"
          className="absolute bottom-10 -inset-e-9 -rotate-10 size-22"
        />
      </div>
    </div>
  );
}

{
  /* <div className="pointer-events-none absolute inset-x-1/2 top-1/2 hidden h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(208,5,7,0.16)_0%,rgba(208,5,7,0.04)_44%,rgba(255,255,255,0)_74%)] blur-xl lg:block" /> */
}
