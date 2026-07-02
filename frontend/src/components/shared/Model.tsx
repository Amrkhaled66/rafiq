import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Overlay from "./Overlay";

const Model = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender || !modalRef.current) return;

    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        },
      );
    } else {
      gsap.to(modalRef.current, {
        y: -150,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setShouldRender(false);
        },
      });
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-90 m-auto flex max-h-[90vh] min-h-fit w-fit items-center justify-center overflow-y-auto  p-4 lg:max-w-[50%]">
        <div ref={modalRef} className=" w-full overflow-visible">
          <div className="w-full overflow-visible">{children}</div>
        </div>
      </div>

      <Overlay isOpen={isOpen} onClick={onClose} />
    </>,
    document.body,
  );
};

export default Model;
