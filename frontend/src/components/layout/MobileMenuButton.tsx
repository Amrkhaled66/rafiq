"use client";

import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";

type MobileMenuButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function MobileMenuButton({
  isOpen,
  onClick,
}: MobileMenuButtonProps) {
  const topLineRef = useRef<HTMLSpanElement | null>(null);
  const middleLineRef = useRef<HTMLSpanElement | null>(null);
  const bottomLineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const top = topLineRef.current;
    const middle = middleLineRef.current;
    const bottom = bottomLineRef.current;

    if (!top || !middle || !bottom) return;

    if (isOpen) {
      gsap.to(top, {
        y: 7,
        rotate: 45,
        duration: 0.25,
        ease: "power2.out",
      });

      gsap.to(middle, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.out",
      });

      gsap.to(bottom, {
        y: -7,
        rotate: -45,
        duration: 0.25,
        ease: "power2.out",
      });
    } else {
      gsap.to([top, middle, bottom], {
        y: 0,
        rotate: 0,
        autoAlpha: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  return (
    <button
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      onClick={onClick}
      className="flex h-10 w-10 flex-col items-center justify-center gap-1.25 rounded-lg transition-colors duration-200 hover:bg-gray-100 md:hidden"
    >
      <span
        ref={topLineRef}
        className="block h-0.5 w-5 origin-center rounded-full bg-gray-700"
      />
      <span
        ref={middleLineRef}
        className="block h-0.5 w-5 rounded-full bg-gray-700"
      />
      <span
        ref={bottomLineRef}
        className="block h-0.5 w-5 origin-center rounded-full bg-gray-700"
      />
    </button>
  );
}