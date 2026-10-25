"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  { label: "HOME", href: "/" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "PRICING", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 -mb-[54px] h-[54px] lg:-mb-[90px] lg:h-[90px]">
      <div className={`pointer-events-auto absolute inset-x-0 top-0 transition-[background-color,box-shadow] duration-200 ${isScrolled ? "bg-white/95 shadow-[0_4px_18px_rgba(15,44,79,0.14)] backdrop-blur" : "bg-transparent"}`}>
        <div className="container mx-auto flex h-[54px] items-center justify-between px-4 lg:h-[90px] lg:px-0">
        <Link href="/" aria-label="Foreclosure Gold home" className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
          <Image src="/images/figma/foreclosure-gold-logo.png" alt="Foreclosure Gold" width={198} height={42} priority className="h-auto w-[130px] lg:w-[198px]" />
        </Link>

        <nav aria-label="Primary navigation" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="px-3 py-2 text-base font-bold leading-none text-[#104170] transition hover:text-[#0d345a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {/* <Link href="#account" aria-label="Open your account" className="flex size-[38px] items-center justify-center rounded-xl bg-white text-[#080808] shadow-sm transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
            <UserRound aria-hidden="true" size={18} strokeWidth={1.7} />
          </Link> */}
          <Link href="#account" className="inline-flex h-[42px] items-center justify-center rounded-lg bg-[#104170] px-3 text-base font-bold text-white transition hover:bg-[#0d345a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
            Create Free Account
          </Link>
          <Link href="#account" className="inline-flex h-[42px] items-center justify-center rounded-lg border border-[#104170] bg-white px-3 text-base font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
            Login
          </Link>
        </div>

        <div className="flex items-center lg:hidden">
          <button type="button" aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" onClick={() => setIsMenuOpen((open) => !open)} className="flex size-[30px] items-center justify-center rounded-md bg-[#104170] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
            {isMenuOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>

        <div id="mobile-navigation" className={`absolute right-4 top-[54px] w-[173px] overflow-hidden rounded-lg bg-white shadow-[0_10px_24px_rgba(15,44,79,0.16)] transition-[max-height,opacity] duration-200 lg:hidden ${isMenuOpen ? "max-h-[274px] opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}>
          <nav aria-label="Mobile navigation" className="flex flex-col gap-4 p-4">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="px-3 py-2 text-base font-bold leading-none text-[#104170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170]">
                {item.label}
              </Link>
            ))}
            <Link href="#" className="flex h-[38px] items-center justify-center rounded-lg bg-[#104170] px-3 text-base font-bold text-white">Log out</Link>
          </nav>
        </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
