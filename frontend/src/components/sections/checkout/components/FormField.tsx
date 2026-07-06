"use client";

import FieldLabel from "./FieldLabel";

const FormField = ({
    label,
    name,
    placeholder,
    icon,
}: {
    label: string;
    name: string;
    placeholder: string;
    icon: string;
}) => {
    return (
        <div>
            <FieldLabel label={label} icon={icon} />

            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 transition focus-within:border-brand-primary focus-within:shadow-[0_0_0_4px_rgba(208,5,7,0.06)]">
                <input
                    required
                    dir="rtl"
                    name={name}
                    type="tel"
                    placeholder={placeholder}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
            </div>
        </div>
    );
};

export default FormField;