export type MonthPlan = {
    id: number;
    months: number;
    label: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    badge?: string;
    name: string
};

const plans: MonthPlan[] = [
    {
        id: 1,
        months: 1,
        label: "شهر",
        price: 199,
        originalPrice: 250,
        name: "اشتراك شهر واحد - رفيق"
    },
    {
        id: 2,
        months: 2,
        label: "شهرين",
        price: 349,
        originalPrice: 400,
        discount: "وفر 50جـ",
        badge: "الأكثر مبيعًا",
        name: "اشتراك شهرين - رفيق"
    },
    {
        id: 3,
        months: 3,
        label: "3 شهور",
        price: 519,
        originalPrice: 600,
        discount: "وفر 80جـ",
        name: "اشتراك 3 شهور - رفيق"
    },
];

export default plans;