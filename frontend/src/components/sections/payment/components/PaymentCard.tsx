"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import type { PaymentMethod } from "../types";

const PaymentCard = ({
    method,
    isSelected,
    onClick,
}: {
    method: PaymentMethod;
    isSelected: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "relative flex min-h-[118px] flex-col items-center justify-center rounded-2xl border p-4 text-center transition duration-300",
                isSelected
                    ? "border-brand-primary bg-[rgba(208,5,7,0.035)] shadow-[0_14px_34px_rgba(208,5,7,0.10)]"
                    : "border-slate-200 bg-white hover:border-[rgba(208,5,7,0.35)]",
            ].join(" ")}
        >
            <span
                className={[
                    "absolute right-3 top-3 h-4 w-4 rounded-full border",
                    isSelected
                        ? "border-brand-primary bg-brand-primary shadow-[inset_0_0_0_3px_white]"
                        : "border-slate-300 bg-white",
                ].join(" ")}
            />

            {typeof method.icon === "string" ? (
                <Icon
                    icon={method.icon}
                    className={[
                        "text-4xl",
                        method.id === "vodafone_cash"
                            ? "text-brand-primary"
                            : "text-[#462B83]",
                    ].join(" ")}
                />
            ) : (
                <Image
                    src={method.icon}
                    alt={method.label}
                    className="size-18 object-contain"
                />
            )}

            <p className="mt-3 text-sm font-black text-slate-950">{method.label}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
                {method.description}
            </p>
        </button>
    );
};

export default PaymentCard;