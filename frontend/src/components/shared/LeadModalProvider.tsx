"use client";

import {
  Activity,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import NewLeadModal from "./NewLeadModel";
import { useLeadSubmission } from "../../hooks/useLeadSubmission";

type LeadModalContextValue = {
  openLeadModal: () => void;
  openLeadModalOnce: () => void;
  closeLeadModal: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const [hasOpenedModal, setHasOpenedModal] = useState(false);
  const { submitLead } = useLeadSubmission();

  const openLeadModal = useCallback(() => {
    setHasOpenedModal(true);
    setShowModal(true);
  }, []);

  const openLeadModalOnce = useCallback(() => {
    setHasOpenedModal((hasOpened) => {
      if (hasOpened) return hasOpened;

      setShowModal(true);
      return true;
    });
  }, []);

  const closeLeadModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const value = useMemo(
    () => ({
      openLeadModal,
      openLeadModalOnce,
      closeLeadModal,
    }),
    [openLeadModal, openLeadModalOnce, closeLeadModal],
  );

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <Activity mode={showModal ? "visible" : "hidden"}>
        <NewLeadModal
          isOpen={showModal}
          onClose={closeLeadModal}
          onSubmit={submitLead}
        />
      </Activity>
    </LeadModalContext.Provider>
  );
}

export function useLeadModal() {
  const context = useContext(LeadModalContext);

  if (!context) {
    throw new Error("useLeadModal must be used within LeadModalProvider");
  }

  return context;
}
