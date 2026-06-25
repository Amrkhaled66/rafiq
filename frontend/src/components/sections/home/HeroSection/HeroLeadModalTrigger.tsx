import LeadModalTrigger from "@/src/components/shared/LeadModalTrigger";

export default function HeroLeadModalTrigger() {
  return (
    <LeadModalTrigger
      autoOpenDelayMs={10000}
      containerClassName="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
      buttonClassName="rounded-full border border-brand-primary bg-brand-primary px-12  py-4! text-lg! font-bold text-white shadow-[0_18px_40px_rgba(107,12,16,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-brand-primary sm:px-24 sm:py-6 sm:text-2xl"
    >
      ابدا مع رفيق مجانًا
    </LeadModalTrigger>
  );
}
