"use client";

import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const BrandLogo = () => (
  <svg aria-hidden="true" viewBox="0 0 158 42" className="h-auto w-[130px]" fill="none">
    <path d="M2 25.5 22.5 8 31.5 14.5 45.5 2l12.5 10.5v13H51V16L45.5 11 33 22v12h-7v-12L22.5 19 9 30.5v8H2v-13Z" fill="#104A7D" />
    <text x="64" y="22" fill="#104A7D" fontSize="12" fontWeight="800" fontFamily="Arial, sans-serif">FORECLOSURE GOLD</text>
    <text x="64" y="31" fill="#104A7D" fontSize="4.7" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing=".25">PREMIUM LEAD SOLUTIONS</text>
  </svg>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#d9e1e8] bg-white"
      style={{
        backgroundImage: "radial-gradient(circle at 2px 2px, rgba(15, 71, 121, 0.075) 2px, transparent 2.5px)",
        backgroundSize: "21px 21px",
      }}
    >
      <div className="relative mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Foreclosure Gold home"
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
        >
          <BrandLogo />
        </Link>

        <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-[37px] lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-xs font-bold uppercase text-[#0f4779] transition hover:text-[#0a3962] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="#account"
            aria-label="Open your account"
            className="flex size-[29px] items-center justify-center rounded-md bg-white text-[#111] shadow-[0_2px_8px_rgba(15,37,60,0.06)] transition hover:bg-[#f6f9fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
          >
            <UserRound aria-hidden="true" size={14} strokeWidth={1.8} />
          </Link>
          <Link
            href="#create-your-book"
            className="inline-flex h-[35px] items-center justify-center rounded-md bg-[#104a7d] px-3 text-xs font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
          >
            Create Free Account
          </Link>
          <Link
            href="#account"
            className="inline-flex h-[35px] items-center justify-center rounded-md border border-[#104a7d] bg-white px-2.5 text-xs font-bold text-[#0f4779] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex size-9 items-center justify-center rounded-md text-[#0f4779] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] lg:hidden"
        >
          {isMenuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={23} />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-[#d9e1e8] bg-white transition-[max-height,opacity] duration-200 lg:hidden ${
          isMenuOpen ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col px-5 py-3 sm:px-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-bold uppercase text-[#0f4779] transition hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d]"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#d9e1e8] pt-3">
            <Link href="#create-your-book" className="flex h-10 items-center justify-center rounded-md bg-[#104a7d] text-xs font-bold text-white">
              Create Free Account
            </Link>
            <Link href="#account" className="flex h-10 items-center justify-center rounded-md border border-[#104a7d] bg-white text-xs font-bold text-[#0f4779]">
              Login
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
