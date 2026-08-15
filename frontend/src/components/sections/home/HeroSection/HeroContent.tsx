// "use client";
import Image from "next/image";
import studentImage from "@/src/assets/student.webp";
import TasksCard from "./TasksCard";
import WeeklyPlanCard from "./WeeklyPlanCard";
import clsx from "clsx";
import target from "@/src/assets/target.webp";

// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";

export default function HeroContent() {


  // useGSAP((()=> {
  //   if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  //     return;
  //   }
  //   gsap.from(".target-icon", {
  //     scale: 0,
  //     y: 10,
  //     rotation: 45,
  //     delay:.5
  //   })
  // }))

  return (
    <div className=" z-10 flex flex-col h-fit  items-start gap-1 lg:gap-10">
      <div className="mt-10 flex flex-row w-full gap-5 lg:hidden">
        <div data-hero-card="left" className="flex-1">
          <TasksCard />
        </div>
        <div data-hero-card="right" className="flex-1">
          <WeeklyPlanCard />
        </div>
      </div>

      <div className="flex  w-full justify-center lg:mt-0">
        <div
          data-hero-student
          className=" z-10  lg:absolute lg:left-30 lg:h-auto h-92 overflow-hidden lg:-bottom-20 "
        >
          <div className="absolute inset-x-8 bottom-10 w-20  lg:w-38  rounded-full bg-[radial-gradient(circle,rgba(208,5,7,0.24)_0%,rgba(208,5,7,0)_72%)] blur-2xl" />
          <Image
            src={studentImage}
            alt="طالبة تحمل جهازا لوحيا"
            priority
            className="relative z-10 w-full h-auto object-contain"
          />
        </div>

        <div
          data-hero-card="left"
          className="absolute left-[4.5rem] top-34 z-20 hidden lg:block xl:left-[6rem]"
        >
          <TasksCard />
        </div>

        <div
          data-hero-card="right"
          className="absolute right-16 top-48 z-20 hidden lg:block xl:right-[5.5rem]"
        >
          <WeeklyPlanCard />
        </div>
        <div
          aria-hidden="true"
          className={clsx(
            "pointer-events-none absolute -inset-e-20 -bottom-10 -z-10",
            "size-50 rounded-full",
            "bg-brand-primary",
            "blur-3xl opacity-40",
          )}
        />
      </div>

      <div
        data-hero-decoration
        className="absolute left-100 top-35 hidden lg:block"
      >
        <Image
          src={target}
          alt="هدف"
          className="size-20 target-icon animate-bounce-slow opacity-80"
        />
      </div>
    </div>
  );
}
