export type MonthPlan = {
    id: number;
    months: number;
    label: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    badge?: string;
};

const plans: MonthPlan[] = [
    {
        id: 1,
        months: 1,
        label: "شهر",
        price: 199,
    },
    {
        id: 2,
        months: 2,
        label: "شهرين",
        price: 349,
        originalPrice: 399,
        discount: "وفر 50جـ",
        badge: "الأكثر مبيعًا",
    },
    {
        id: 3,
        months: 3,
        label: "3 شهور",
        price: 519,
        originalPrice: 599,
        discount: "وفر 80جـ",
    },
];

export default plans;