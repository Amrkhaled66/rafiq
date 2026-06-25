"use client";

import Link from "next/link";
import Button from "@/src/components/shared/Button";
import { useMobileMenuAnimation } from "@/src/hooks/useMobileMenuAnimation";
import LeadModalTrigger from "../shared/LeadModalTrigger";

type NavLink = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  isOpen: boolean;
  navLinks: NavLink[];
  onClose: () => void;
};

export default function MobileMenu({
  isOpen,
  navLinks,
  onClose,
}: MobileMenuProps) {
  const { menuRef, ctaRef, setLinkRef } = useMobileMenuAnimation({ isOpen });

  return (
    <div
      ref={menuRef}
      className="absolute left-0 right-0 top-[calc(100%+0.75rem)] hidden rounded-4xl border border-red-100 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:hidden"
    >
      <div className="flex flex-col gap-2 text-right">
        {navLinks.map((link, index) => (
          <Link
            key={link.label}
            ref={(el) => setLinkRef(el, index)}
            href={link.href}
            onClick={onClose}
            className="rounded-2xl px-4 py-3 text-sm font-bold text-gray-600 transition-colors duration-200 hover:bg-red-50 hover:text-brand-primary"
          >
            {link.label}
          </Link>
        ))}

        <div ref={ctaRef} className="pt-2">
          <LeadModalTrigger
            buttonClassName="rounded-full border w-full border-brand-primary bg-brand-primary px-6 py-3 font-bold text-white transition"
          >
            خليك جزء من رفيق
          </LeadModalTrigger>

        </div>
      </div>
    </div>
  );
}
