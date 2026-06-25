"use client";

import { useCallback } from "react";
import type { LeadFormData } from "../lib/hubspot";

type HubSpotErrorResponse = {
    error?: string;
};

export function useLeadSubmission() {
    const submitLead = useCallback(async (data: LeadFormData) => {
        const response = await fetch("/api/hubspot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseBody = (await response.json().catch(() => null)) as
            | HubSpotErrorResponse
            | null;

        if (!response.ok) {
            throw new Error(
                responseBody?.error ?? "تعذر إرسال البيانات، حاول مرة أخرى لاحقًا.",
            );
        }
    }, []);

    return { submitLead };
}