"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProblemCard from "./ProblemCard";
import studentConfusing from "@/src/assets/student-confusing.png";
import targetIcon from "@/src/assets/target-icon.png";
import questionIcon from "@/src/assets/question.png";
import calenderIcon from "@/src/assets/calender-icon.png";
import clockIcon from "@/src/assets/clock.png";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const problemCards = [
  {
    title: "مفيش التزام",
    description: "بتزاكر لوحدك ومفيش التزام بالمزاكرة...",
    icon: targetIcon,
    iconType: "image",
    accentClassName: "bg-[rgba(208,5,7,0.08)] text-brand-primary",
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
    title: "مش عارف تبدأ منين",
    description: "كل يوم فيه حاجات كتير، بس مفيش أولوية واضحة.",
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
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.from("[data-problem-decoration]", {
        autoAlpha: 0,
        y: 14,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: container.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
          once: true,
          // markers: true,
        },
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="flex lg:block flex-col-reverse overflow-hidden sm:drop-shadow-sm rounded-3xl px-3 lg:px-8  bg-[linear-gradient(180deg,#fffdfd_0%,#fff6f6_56%,#ffffff_100%)] py-12 w-full sm:grid-cols-2 "
    >
      <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
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
        <div className="absolute top-6 -inset-e-9 h-20 w-18">
          <div data-problem-decoration className="size-full">
            <Image
              src={questionIcon}
              alt="رمز سؤال"
              className="size-full -rotate-20"
            />
          </div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -inset-s-9 h-20 w-18">
          <div data-problem-decoration className="size-full">
            <Image
              src={questionIcon}
              alt="رمز سؤال"
              className="size-full rotate-20"
            />
          </div>
        </div>
        <div className="absolute top-10 -translate-y-1/2 -inset-s-9 size-22">
          <div data-problem-decoration className="size-full">
            <Image
              src={calenderIcon}
              alt="رمز تقويم"
              className="size-full rotate-10"
            />
          </div>
        </div>
        <div className="absolute bottom-10 -inset-e-9 size-22">
          <div data-problem-decoration className="size-full">
            <Image
              src={clockIcon}
              alt="رمز ساعة"
              className="size-full -rotate-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


