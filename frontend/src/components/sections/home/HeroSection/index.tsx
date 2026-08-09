"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import AccentDot from "./AccentDot";
import HeroHeader from "./HeroHeader";
import HeroContent from "./HeroContent";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // useLayoutEffect(() => {
  //   const media = gsap.matchMedia();

  //   const context = gsap.context(() => {
  //     media.add("(prefers-reduced-motion: no-preference)", () => {
  //       const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

  //       timeline
  //         .from("[data-hero-reveal]", {
  //           autoAlpha: 0,
  //           y: 18,
  //           duration: 0.55,
  //           stagger: 0.09,
  //         })
  //         .from(
  //           "[data-hero-student]",
  //           {
  //             autoAlpha: 0,
  //             y: 28,
  //             scale: 0.985,
  //             duration: 0.7,
  //           },
  //           "-=0.25",
  //         )
  //         .from(
  //           "[data-hero-card='left']",
  //           { autoAlpha: 0, x: -22, y: 10, duration: 0.6 },
  //           "-=0.45",
  //         )
  //         .from(
  //           "[data-hero-card='right']",
  //           { autoAlpha: 0, x: 22, y: 10, duration: 0.6 },
  //           "<0.06",
  //         )
  //         .from(
  //           "[data-hero-decoration]",
  //           { autoAlpha: 0, scale: 0.9, duration: 0.45 },
  //           "-=0.3",
  //         );
  //     });
  //   }, sectionRef);

  //   return () => {
  //     media.revert();
  //     context.revert();
  //   };
  // }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden  pt-32 sm:pt-36 min-h-screen lg:pt-40"
    >
      <AccentDot className="left-8 bottom-28 h-4 w-4 lg:h-5 lg:w-5" />
      <AccentDot className="right-10 bottom-24 h-3 w-3 lg:h-4 lg:w-4" />

      <div className=" mx-auto flex w-full max-w-7xl flex-col px-4  sm:px-6 lg:px-8 lg:pb-10">
        <div className=" flex flex-col items-center">
          <HeroHeader />
          <HeroContent />
        </div>
      </div>
    </section>
  );
}
