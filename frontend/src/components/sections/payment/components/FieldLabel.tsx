"use client";

import { Icon } from "@iconify/react";

const FieldLabel = ({ label, icon }: { label: string; icon: string }) => {
    return (
        <label className="flex items-center gap-2 text-sm font-black text-slate-900">
            <Icon icon={icon} className="text-lg text-brand-primary" />
            <span>{label}</span>
        </label>
    );
};

export default FieldLabel;