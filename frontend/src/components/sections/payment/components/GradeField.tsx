"use client";

import FieldLabel from "./FieldLabel";

const GradeField = () => {
    return (
        <div>
            <FieldLabel label="الصف الدراسي" icon="solar:square-academic-cap-bold" />

            <input type="hidden" name="grade" value="ثالثة ثانوي" />

            <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                <span className="text-sm font-black text-slate-950">ثالثة ثانوي</span>
                <span className="rounded-full bg-[rgba(208,5,7,0.08)] px-3 py-1 text-xs font-bold text-brand-primary">
                    الصف المحدد
                </span>
            </div>
        </div>
    );
};

export default GradeField;