"use client";

const SectionTitle = ({ title }: { title: string; icon: string }) => {
    return (
        <div className="flex items-center gap-2">
            <div>
                <h2 className="text-xl font-black text-slate-950 sm:text-2xl">
                    {title}
                </h2>
                <div className="mt-2 h-1 w-12 rounded-full bg-brand-primary" />
            </div>
        </div>
    );
};

export default SectionTitle;