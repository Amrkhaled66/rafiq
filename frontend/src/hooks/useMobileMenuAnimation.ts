"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type UseMobileMenuAnimationProps = {
  isOpen: boolean;
};

export function useMobileMenuAnimation({ isOpen }: UseMobileMenuAnimationProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const setLinkRef = (el: HTMLAnchorElement | null, index: number) => {
    if (el) linksRef.current[index] = el;
  };

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const links = linksRef.current.filter(Boolean);
    const cta = ctaRef.current;

    if (isOpen) {
      gsap.set(menu, {
        display: "block",
        pointerEvents: "auto",
      });

      gsap.fromTo(
        menu,
        {
          autoAlpha: 0,
          y: -12,
          scale: 0.96,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        [...links, cta].filter(Boolean),
        {
          autoAlpha: 0,
          y: 14,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          delay: 0.08,
          ease: "power3.out",
        }
      );
    } else {
      gsap.to(menu, {
        autoAlpha: 0,
        y: -10,
        scale: 0.96,
        duration: 0.25,
        ease: "power2.in",
        pointerEvents: "none",
        onComplete: () => {
          gsap.set(menu, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  return {
    menuRef,
    ctaRef,
    setLinkRef,
  };
}