"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Logo1 from "@/public/logo1.svg";
import Button from "../shared/Button";

const sectionItems = [
  { text: "الرئيسية", href: "#" },
  { text: "إزاي رفيق بيشتغل؟", href: "#" },
  { text: "الباقات", href: "#" },
  { text: "الأسئلة الشائعة", href: "#" },
];

const contactItems = [
  { icon: "ic:baseline-whatsapp", text: "واتساب" },
  { icon: "solar:letter-linear", text: "hello@rafiq.study" },
  { icon: "solar:map-point-linear", text: "القاهرة، مصر" },
];

const socialItems = [
  { icon: "mdi:instagram", label: "Instagram" },
  { icon: "ic:baseline-whatsapp", label: "WhatsApp" },
  { icon: "mdi:youtube", label: "YouTube" },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState<"sections" | "contact" | null>(
    "sections",
  );

  const toggleSection = (section: "sections" | "contact") => {
    setOpenSection((current) => (current === section ? null : section));
  };

  return (
    <footer dir="rtl" className=" mx-auto px-3 pt-8 ">
      <div className="overflow-hidden rounded-4xl border-t border-[#f3dada] bg-[#fffdfd] shadow-[0_20px_55px_rgba(144,15,25,0.08)]">
        <div className="grid gap-6 px-5 py-8 sm:px-8 sm:py-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.85fr] lg:gap-14 lg:px-10 lg:py-12">
          {/* Brand */}
          <section className="space-y-5 text-center md:col-span-2 lg:col-span-1 lg:text-right">
            <div className="space-y-4">
              <Image
                src={Logo1}
                alt="شعار رفيق"
                className="mx-auto h-auto w-14 lg:mx-0"
              />

              <p className="mx-auto max-w-sm text-sm leading-8 text-slate-600 sm:text-base lg:mx-0">
                رفيق هيساعدك تنظم يومك، تلتزم بخطتك، وتحقق أهدافك خطوة بخطوة.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl!"
            >
              <Icon icon="solar:calendar-linear" className="size-5 shrink-0" />
              <span>احجز جلسة البداية</span>
            </Button>
          </section>

          {/* Sections */}
          <section className="border-t border-[#f1e6e6] pt-5 text-right lg:border-0 lg:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("sections")}
              className="flex w-full items-center justify-between gap-4 lg:pointer-events-none lg:block lg:w-auto"
              aria-expanded={openSection === "sections"}
            >
              <div className="inline-flex flex-col items-start gap-2">
                <h2 className="text-xl font-bold text-slate-900">الأقسام</h2>
                <span className="h-1 w-14 rounded-full bg-brand-primary" />
              </div>

              <Icon
                icon="solar:alt-arrow-down-linear"
                className={`size-6 text-brand-primary transition-transform duration-300 lg:hidden ${
                  openSection === "sections" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 lg:grid-rows-[1fr] ${
                openSection === "sections"
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="space-y-3 pt-5 text-sm text-slate-600 sm:text-base">
                  {sectionItems.map((item) => (
                    <li key={item.text}>
                      <a
                        href={item.href}
                        className="transition-colors duration-200 hover:text-brand-primary"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-[#f1e6e6] pt-5 text-right lg:border-0 lg:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("contact")}
              className="flex w-full items-center justify-between gap-4 lg:pointer-events-none lg:block lg:w-auto"
              aria-expanded={openSection === "contact"}
            >
              <div className="inline-flex flex-col items-start gap-2">
                <h2 className="text-xl font-bold text-slate-900">تواصل معنا</h2>
                <span className="h-1 w-14 rounded-full bg-brand-primary" />
              </div>

              <Icon
                icon="solar:alt-arrow-down-linear"
                className={`size-6 text-brand-primary transition-transform duration-300 lg:hidden ${
                  openSection === "contact" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 lg:grid-rows-[1fr] ${
                openSection === "contact"
                  ? "grid-rows-[1fr]"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-5 pt-5">
                  <ul className="space-y-3 text-sm text-slate-600 sm:text-base">
                    {contactItems.map((item) => (
                      <li key={item.text} className="flex items-center gap-3">
                        <Icon
                          icon={item.icon}
                          className="size-5 shrink-0 text-brand-primary"
                        />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-3">
                    {socialItems.map((item) => (
                      <a
                        key={item.label}
                        href="#"
                        aria-label={item.label}
                        className="inline-flex size-11 items-start transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:text-brand-primary hover:shadow-[0_10px_24px_rgba(208,5,7,0.08)]"
                      >
                        <Icon icon={item.icon} className="size-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-[#f1e6e6] px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-slate-500 lg:flex-row lg:text-right">
            <p>© {new Date().getFullYear()} رفيق. كل الحقوق محفوظة.</p>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <a
                href="#"
                className="transition-colors duration-200 hover:text-brand-primary"
              >
                سياسة الخصوصية
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="#"
                className="transition-colors duration-200 hover:text-brand-primary"
              >
                الشروط والأحكام
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
