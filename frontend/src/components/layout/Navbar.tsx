"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../shared/Button";
import MobileMenu from "./MobileMenu";
import MobileMenuButton from "./MobileMenuButton";

const navLinks = [
  { label: "الرئيسية", href: "#" },
  { label: "إزاي يشتغل؟", href: "#how-it-works" },
  { label: "الباقات", href: "#pricing" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="container fixed left-0 right-0 top-2 z-50 mx-auto max-w-5xl rounded-full bg-white font-bold! drop-shadow-xl">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-1 shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo1.svg"
                alt="Logo"
                width={60}
                height={60}
                className="size-14 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden flex-1 items-center justify-between gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-sm font-bold text-gray-600 transition-colors duration-200 hover:text-brand-primary"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-brand-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* CTA + Burger */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <Button
              variant="primary"
              className="hidden rounded-full! px-6 py-3 md:block"
            >
              احجز جلسة البداية
            </Button>

            <MobileMenuButton
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            />
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        navLinks={navLinks}
        onClose={() => setIsMenuOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
