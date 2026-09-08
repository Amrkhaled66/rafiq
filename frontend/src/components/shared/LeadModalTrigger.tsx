"use client";

import { useEffect, type ReactNode } from "react";
import Button from "./Button";
import { useLeadModal } from "./LeadModalProvider";

type LeadModalTriggerProps = {
  children: ReactNode;
  containerClassName?: string;
  buttonClassName?: string;
  autoOpenDelayMs?: number;
};

export default function LeadModalTrigger({
  children,
  containerClassName,
  buttonClassName = "",
  autoOpenDelayMs,
}: LeadModalTriggerProps) {
  const { openLeadModal, openLeadModalOnce } = useLeadModal();

  useEffect(() => {
    if (!autoOpenDelayMs) return;

    const timer = window.setTimeout(() => {
      openLeadModalOnce();
    }, autoOpenDelayMs);

    return () => window.clearTimeout(timer);
  }, [autoOpenDelayMs, openLeadModalOnce]);

  return (
    <div className={containerClassName}>
      <Button
        type="button"
        onClick={openLeadModal}
        className={`rounded-full! border w-full border-brand-primary bg-brand-primary px-6 py-3 font-bold text-white transition ${buttonClassName}`}
      >
        {children}
      </Button>
    </div>
  );
}
