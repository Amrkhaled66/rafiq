import type { StaticImageData } from "next/image";

export type DurationOption = {
    id: number;
    label: string;
    price: number;
    saving?: string;
};

export type PaymentMethod = {
    id: "instapay" | "vodafone_cash";
    label: string;
    description: string;
    icon: string | StaticImageData;
};