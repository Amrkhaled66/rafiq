"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import MobileMenuButton from "./MobileMenuButton";
import LeadModalTrigger from "../shared/LeadModalTrigger";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "يعني ايه رفيق؟", href: "/#solve" },
  { label: "الباقات", href: "/#pricing" },
  { label: "حمّل التطبيق", href: "/mobile-app" },
];

const Navbar = ({ variant = "default" }: { variant?: "default" | "download" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const links = navLinks.map((link) => ({
    ...link,
    isActive: pathname === link.href,
  }));

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className={`fixed z-50 mx-auto rounded-full bg-white font-bold! ${
        variant === "download"
          ? "left-4 right-4 top-4 max-w-306 shadow-[0_8px_40px_rgba(35,20,20,0.055)] ring-1 ring-black/[0.025] md:left-8 md:right-8 md:top-6"
          : "container left-0 right-0 top-2 max-w-5xl drop-shadow-xl"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-1 flex items-start shrink-0">
            <Link href="/" className="flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary">
              <Image
                src="/logo1.svg"
                alt="رفيق — الرئيسية"
                width={60}
                height={60}
                className="size-14 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden items-center justify-center gap-4 md:flex lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-current={link.isActive ? "page" : undefined}
                className={`group relative whitespace-nowrap text-sm font-bold transition-colors duration-200 hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-brand-primary ${link.isActive ? "text-brand-primary" : "text-gray-600"}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-brand-primary transition-all duration-300 group-hover:w-full ${link.isActive ? "w-full" : "w-0"}`} />
              </Link>
            ))}
          </div>

          {/* CTA + Burger */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <LeadModalTrigger
              containerClassName="hidden md:block"
              buttonClassName="rounded-full border border-brand-primary bg-brand-primary px-6 py-3 font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
            >
              خليك جزء من رفيق
            </LeadModalTrigger>

            <MobileMenuButton
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            />
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        navLinks={links}
        onClose={() => setIsMenuOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
