"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

import CheckoutFaq from "@/src/components/sections/payment/CheckoutFaq";
import CheckoutForm from "@/src/components/sections/payment/CheckoutForm";

const FawaterakCheckoutPage = () => {
  return (
    <main dir="rtl" className="min-h-screen bg-[#fbfbfb] text-slate-950">
      {/* <CheckoutHeader /> */}

      <section className="relative px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 pt-28 md:grid-cols-[1.75fr_1fr]">
          <div>
            {/* <CheckoutForm mode="fawaterak" /> */}
          </div>
          {/* <CheckoutFaq /> */}
        </div>
      </section>
    </main>
  );
};

export default FawaterakCheckoutPage;

const CheckoutHeader = () => {
  return (
    <header className="fixed z-50 w-full overflow-hidden bg-brand-primary text-white">
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute left-20 top-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-row-reverse items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur transition hover:bg-white/15 hover:text-white"
        >
          <Icon
            icon="solar:arrow-right-linear"
            className="text-lg transition group-hover:translate-x-1"
          />
          رجوع
        </Link>

        <div className="space-y-2 text-start">
          <h1 className="text-2xl font-black leading-tight sm:text-4xl">
            الدفع الإلكتروني
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/75">
            أكمل عملية الاشتراك بأمان
          </p>
        </div>
      </div>
    </header>
  );
};
