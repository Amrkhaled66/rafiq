import { Icon } from "@iconify/react";

export type MonthPlan = {
    id: number;
    months: number;
    price: number;
    discount?: string;
    badge?: string;
    originalPrice?: number;
};

type MonthSelectProps = {
    plans: MonthPlan[];
    selectedId: number;
    onChange: (plan: MonthPlan) => void;
};

const MonthSelect = ({ plans, selectedId, onChange }: MonthSelectProps) => {
    return (
        <div className="mb-5 rounded-3xl border border-slate-200 bg-white/80 p-1 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-3 gap-1">
                {plans.map((plan) => {
                    const isSelected = plan.id === selectedId;

                    return (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => onChange(plan)}
                            className={[
                                "relative rounded-[22px] px-3 py-3 text-center transition duration-300",
                                isSelected
                                    ? "border border-brand-primary bg-[rgba(208,5,7,0.06)] text-brand-primary shadow-[0_12px_28px_rgba(208,5,7,0.12)]"
                                    : "border border-transparent text-slate-700 hover:bg-slate-50",
                            ].join(" ")}
                        >
                            {isSelected && (
                                <span className="absolute inset-e-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white">
                                    <Icon icon="material-symbols:check-rounded" className="text-xs" />
                                </span>
                            )}

                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-primary px-2.5 py-0.5 text-[10px] font-bold text-white">
                                    {plan.badge}
                                </span>
                            )}

                            <div className="text-2xl font-black leading-none">
                                {plan.months}
                            </div>

                            <div className="mt-1 text-xs font-bold">
                                {plan.months === 1 ? "شهر" : "شهور"}
                            </div>

                            {plan.discount && (
                                <div className="relative mx-auto mt-2 w-fit text-[11px] font-bold text-brand-primary">
                                    <span>{plan.discount}</span>
                                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-brand-primary/70" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthSelect;