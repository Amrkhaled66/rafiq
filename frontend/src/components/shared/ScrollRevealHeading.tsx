"use client";

import { useRef, type ReactNode } from "react";

import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

type ScrollRevealHeadingProps = {
  children: ReactNode;
  className?: string;
};

export default function ScrollRevealHeading({
  children,
  className,
}: ScrollRevealHeadingProps) {
  const title = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (
        !title.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const split = new SplitText(title.current, { type: "words" });

      gsap.fromTo(
        split.words,
        { opacity: 0.2 },
        {
          opacity: 1,
          ease: "none",
          stagger: { each: 0.6 },
          scrollTrigger: {
            trigger: title.current,
            start: "top 80%",
            end: "bottom 33%",
            scrub: true,
            // invalidateOnRefresh: true,
          },
        },
      );

      return () => split.revert();
    },
    { scope: title },
  );

  return (
    <h2 ref={title} dir="rtl" className={clsx("section-title", className)}>
      {children}
    </h2>
  );
}
