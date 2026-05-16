import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const TOOLTIP_WIDTH = 320;
const VIEWPORT_GAP = 12;

export default function InfoTooltipCell({
  children,
  tooltipText,
  tooltipLabel = "عرض التفاصيل",
}: {
  children: ReactNode;
  tooltipText?: string | null;
  tooltipLabel?: string;
}) {
  const normalizedText = tooltipText?.trim();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const preferredLeft = rect.right - TOOLTIP_WIDTH;
      const maxLeft = window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_GAP;
      const left = Math.min(Math.max(preferredLeft, VIEWPORT_GAP), maxLeft);
      const top = Math.max(rect.top - VIEWPORT_GAP, VIEWPORT_GAP);

      setPosition({
        top,
        left,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="min-w-0 flex-1">{children}</div>

      {normalizedText ? (
        <>
          <div
            ref={triggerRef}
            className="shrink-0"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
          >
            <button
              type="button"
              aria-label={tooltipLabel}
              className="flex size-5 items-center justify-center rounded-full border border-brand-primary/20 bg-brand-primary-soft text-[11px] font-bold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white focus:bg-brand-primary focus:text-white focus:outline-none"
            >
              !
            </button>
          </div>

          {isOpen
            ? createPortal(
                <div
                  className="pointer-events-none fixed z-1000 w-80 max-w-[calc(100vw-24px)] -translate-y-full rounded-xl border border-gray-200 bg-white p-3 text-right text-xs leading-6 text-foreground shadow-lg"
                  style={{
                    top: position.top,
                    left: position.left,
                  }}
                >
                  <p className="max-h-48 overflow-y-auto whitespace-pre-wrap wrap-break-word">
                    {normalizedText}
                  </p>
                </div>,
                document.body,
              )
            : null}
        </>
      ) : null}
    </div>
  );
}
