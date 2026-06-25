"use client";

import { useEffect, useState, type ReactNode } from "react";
import NewLeadModal from "./NewLeadModel";
import { useLeadSubmission } from "../../hooks/useLeadSubmission";
import Button from "./Button";

type LeadModalTriggerProps = {
  children: ReactNode;
  containerClassName?: string;
  buttonClassName?: string;
  autoOpenDelayMs?: number;
};

export default function LeadModalTrigger({
  children,
  containerClassName,
  buttonClassName,
  autoOpenDelayMs,
}: LeadModalTriggerProps) {
  const [showModal, setShowModal] = useState(false);
  const { submitLead } = useLeadSubmission();

  useEffect(() => {
    if (!autoOpenDelayMs) return;

    const timer = window.setTimeout(() => {
      setShowModal(true);
    }, autoOpenDelayMs);

    return () => window.clearTimeout(timer);
  }, [autoOpenDelayMs]);

  return (
    <>
      <div className={containerClassName}>
        <Button
          type="button"
          onClick={() => setShowModal(true)}
          className={`rounded-full! border w-full border-brand-primary bg-brand-primary px-6 py-3 font-bold text-white transition ${buttonClassName}`}
        >
          {children}
        </Button>
      </div>

      <NewLeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={submitLead}
      />
    </>
  );
}
