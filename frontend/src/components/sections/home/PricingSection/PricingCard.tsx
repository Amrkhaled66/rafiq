'use client';

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import MonthSelect, { type MonthPlan } from "./MonthSelect";
import plans from "@/src/data/plans";
import Link from "next/dist/client/link";
const features = [
    { label: "جلسة بداية", icon: "solar:user-rounded-bold" },
    { label: "خطة مذاكرة مناسبة", icon: "solar:calendar-bold" },
    { label: "متابعة من كوتش", icon: "solar:chat-round-dots-bold" },
    { label: "تنظيم المهام من الأبلكيشن", icon: "solar:check-circle-bold" },
    { label: "متابعة التقدم والالتزام", icon: "solar:chart-2-bold" },
];

const PricingCard = () => {
    const [selectedPlanId, setSelectedPlanId] = useState(1);

    const selectedPlan = useMemo(
        () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0],
        [selectedPlanId]
    );

    return (
        <div
            dir="rtl"
            className="relative mx-auto w-full max-w-[430px] overflow-hidden rounded-[30px] border border-[rgba(208,5,7,0.16)] bg-white px-6 py-6 text-center shadow-[0_24px_70px_rgba(208,5,7,0.13)]"
        >
            <CardGlow />

            <div className="relative z-10">
                {/* <PackageBadge /> */}

                <MonthSelect
                    plans={plans}
                    selectedId={selectedPlanId}
                    onChange={(plan) => setSelectedPlanId(plan.id)}
                />

                <PriceBlock plan={selectedPlan} />

                <Divider />

                <p className="mx-auto max-w-75 text-xs sm:text-sm md:text-base leading-6 text-slate-600">
                    خطة واضحة ومتابعة حقيقية تساعدك تذاكر وتلتزم خطوة بخطوة.
                </p>

                <FeatureList />

                <StartButton />

                <TrustNote />
            </div>
        </div>
    );
};

export default PricingCard;

const CardGlow = () => (
    <div className="pointer-events-none absolute -top-28 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[rgba(208,5,7,0.08)] blur-3xl" />
);

const PackageBadge = () => (
    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-[rgba(208,5,7,0.08)] px-4 py-1.5 text-sm font-bold text-brand-primary">
        <Icon icon="solar:crown-bold" className="text-base" />
        <span>الباقة الشهرية</span>
    </div>
);

const PriceBlock = ({ plan }: { plan: MonthPlan }) => (
    <div>
        <div className="mt-2 flex items-end justify-center gap-2 text-brand-primary">
            <span className="mb-2 text-sm sm:text-base font-bold">جنيه</span>
            <span className="text-5xl sm:text-6xl md:text-[64px] font-black leading-none tracking-tight">
                {plan.price}
            </span>
        </div>

        <p className="mt-1 text-sm sm:text-base font-semibold text-slate-500">
            {plan.months === 1 ? "شهريًا" : `لمدة ${plan.months} شهور`}
        </p>
    </div>
);

const Divider = () => (
    <div className="my-4 h-px w-full bg-linear-to-l from-transparent via-slate-200 to-transparent" />
);

const FeatureList = () => (
    <div className="mt-3">
        {features.map((feature) => (
            <FeatureItem key={feature.label} {...feature} />
        ))}
    </div>
);

const FeatureItem = ({ label, icon }: { label: string; icon: string }) => (
    <div className="flex items-center gap-3 border-b border-slate-100 py-1.5 last:border-b-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(208,5,7,0.08)] text-brand-primary">
            <Icon icon={icon} className="text-[17px]" />
        </span>

        <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
);

const StartButton = () => (
    <Link
        href="/checkout"
        type="button"
        className="group mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-brand-primary px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base font-extrabold text-white shadow-[0_14px_30px_rgba(208,5,7,0.26)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(208,5,7,0.34)] active:translate-y-0"
    >
        <span>ابدأ مع رفيق الآن</span>

        <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/95 text-brand-primary transition duration-300 group-hover:-translate-x-1">
            <Icon icon="solar:arrow-left-linear" className="text-sm sm:text-base" />
        </span>
    </Link>
);

const TrustNote = () => (
    <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
        <Icon icon="solar:shield-check-bold" className="text-sm" />
        <span>بدون تعقيد — هنساعدك تبدأ صح.</span>
    </div>
);