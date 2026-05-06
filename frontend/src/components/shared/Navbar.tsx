"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
const Navbar = () => {
  const navLinks = [
    { label: "الرئيسية", href: "#" },
    { label: "إزاي يشتغل؟", href: "#how-it-works" },
    { label: "الباقات", href: "#pricing" },
  ];

  return (
    <nav className="fixed top-2 rounded-full bg-white max-w-5xl left-0 right-0 z-50 font-bold! container mx-auto drop-shadow-xl">
      <div className="mx-auto px-4  sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="shrink-0 flex-1">
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

          {/* Navigation Links - Center (desktop) */}
          <div className="hidden md:flex items-center flex-1 justify-between gap-8 ">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-sm font-bold text-gray-600 transition-colors duration-200 hover:text-(--brand-primary) group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-(--brand-primary) rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right side: CTA + Burger */}
          <div className="flex justify-end flex-1 items-center gap-3">
            {/* CTA Button */}
            <Button variant="primary" className="!rounded-full sm:block hidden px-6 py-3">
              احجز جلسة البداية
            </Button>

            {/* Hamburger (mobile only) */}
            <button
              aria-label="Toggle menu"
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200 gap-[5px]"
            >
              <span className="block w-5 h-0.5 bg-gray-700 rounded-full origin-center" />
              <span className="block w-5 h-0.5 bg-gray-700 rounded-full" />
              <span className="block w-5 h-0.5 bg-gray-700 rounded-full origin-center" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
