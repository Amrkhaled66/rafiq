"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const WORDS = ["الكسل", "الاحباط", "التشتت"];
const INTERVAL_MS = 2800;

export default function AnimatedWord() {
  const [index, setIndex] = useState(0);
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      // Exit: slide up + fade out
      tl.to([outerRef.current, innerRef.current], {
        y: -28,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        stagger: 0,
      })
        // Swap the word (invisible during transition)
        .call(() => {
          setIndex((prev) => (prev + 1) % WORDS.length);
        })
        // Reset position below
        .set([outerRef.current, innerRef.current], { y: 28, opacity: 0 })
        // Enter: slide up into place + fade in
        .to([outerRef.current, innerRef.current], {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0,
        });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const word = WORDS[index];

  return (
    <span className="relative lg:text-[5.6rem]! mt-1 block  overflow-hidden">
      {/* Ghost stroke / blur layer */}
      <span
        ref={outerRef}
        aria-hidden="true"
        className="
          absolute inset-0 text-transparent
          [-webkit-text-stroke:12px_rgba(208,5,7,0.08)]
          blur-[1.5px]
        "
      >
        {word}
      </span>

      {/* Visible outlined word */}
      <span
        ref={innerRef}
        className="
          relative block text-white
          [-webkit-text-stroke:2px_var(--brand-primary)]
          [paint-order:stroke_fill]
          drop-shadow-[0_12px_26px_rgba(208,5,7,0.12)]
        "
      >
        {word}
      </span>
    </span>
  );
}