import InfoBadge from "@/src/components/shared/InfoBedge";

export default function PricingHeader() {
    return (
        <div className="mx-auto max-w-3xl space-y-4 text-center">
            <InfoBadge
                icon="solar:magic-stick-3-bold-duotone"
                iconClassName="!size-5"
                text="سعر الاشتراك"
            />

            <h2 className="section-title max-w-xl lg:max-w-none lg:text-nowrap">
                <span>ابدأ مع رفيق بـــ</span>
                <span className="text-brand-primary text-4xl sm:text-5xl md:text-6xl">{" "}199 جنيه</span>
            </h2>

            <p className="section-subTitle max-w-sm">
                كل اللي هتحتاجه علشان تنظم مذاكرتك، وتلتزم بخطتك، وتلاقي متابعة حقيقية تساعدك تكمل.
            </p>
        </div>
    );
}
