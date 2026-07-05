"use client";

import { Icon } from "@iconify/react";
import FieldLabel from "./FieldLabel";

const ProofUpload = ({
    file,
    isDragging,
    onDragStateChange,
    onFileSelect,
    onRemove,
}: {
    file: File | null;
    isDragging: boolean;
    onDragStateChange: (value: boolean) => void;
    onFileSelect: (file?: File) => void;
    onRemove: () => void;
}) => {
    return (
        <div>
            <FieldLabel label="صورة التحويل" icon="solar:gallery-add-bold" />

            <label
                onDragOver={(event) => {
                    event.preventDefault();
                    onDragStateChange(true);
                }}
                onDragLeave={() => onDragStateChange(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    onDragStateChange(false);
                    onFileSelect(event.dataTransfer.files?.[0]);
                }}
                className={[
                    "mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center transition duration-300",
                    isDragging
                        ? "border-brand-primary bg-[rgba(208,5,7,0.06)]"
                        : "border-slate-300 bg-slate-50 hover:border-brand-primary hover:bg-[rgba(208,5,7,0.035)]",
                ].join(" ")}
            >
                <input
                    name="proofImage"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => onFileSelect(event.target.files?.[0])}
                />

                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-primary shadow-sm">
                    <Icon icon="solar:upload-square-bold" className="text-2xl" />
                </span>

                {file ? (
                    <>
                        <p className="mt-3 text-sm font-black text-slate-950">
                            {file.name}
                        </p>
                        <button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault();
                                onRemove();
                            }}
                            className="mt-2 text-xs font-bold text-brand-primary"
                        >
                            حذف الصورة
                        </button>
                    </>
                ) : (
                    <>
                        <p className="mt-3 text-sm font-black text-slate-950">
                            اسحب صورة التحويل هنا أو اضغط للرفع
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                            PNG, JPG, WEBP
                        </p>
                    </>
                )}
            </label>
        </div>
    );
};

export default ProofUpload;