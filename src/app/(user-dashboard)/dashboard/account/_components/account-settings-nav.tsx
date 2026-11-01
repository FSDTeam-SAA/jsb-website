"use client";

import {
  CreditCard,
  Headphones,
  KeyRound,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const items = [
  { href: "/dashboard/account/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/account/change-password", label: "Change Password", icon: KeyRound },
  { href: "/dashboard/account/subscription-plan", label: "Subscription Plan", icon: CreditCard },
  { href: "/dashboard/account/contact-support", label: "Contact & Support", icon: Headphones },
] as const;

const AccountSettingsNav = ({
  onDelete,
}: {
  onDelete: () => void;
}) => {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    let frame: number | null = null;

    const updatePinnedState = () => {
      frame = null;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const nextPinned = isDesktop && (sidebarRef.current?.getBoundingClientRect().top ?? Infinity) <= 92;
      setIsPinned((current) => (current === nextPinned ? current : nextPinned));
    };

    const onScrollOrResize = () => {
      if (frame === null) frame = window.requestAnimationFrame(updatePinnedState);
    };

    updatePinnedState();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
  <aside
    ref={sidebarRef}
    data-lenis-prevent
    className={`h-fit w-full shrink-0 self-start rounded-[8px] bg-white p-3 transition-[box-shadow,border-color] duration-300 ease-out lg:sticky lg:top-[91px] lg:max-h-[calc(100vh-107px)] lg:w-[421px] lg:overflow-y-auto ${
      isPinned
        ? "border border-[#dfe9f4] shadow-[0_12px_30px_rgba(16,65,112,0.12)]"
        : "border border-transparent shadow-none"
    }`}
  >
    <h2 className="border-b border-[#e4eaf8] pb-4 text-xl font-bold text-[#0e1224]">
      Settings
    </h2>
    <nav className="mt-4 space-y-2">
      {items.map(({ href, label, icon: Icon }) => {
        const selected = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={selected ? "page" : undefined}
            className={`flex min-h-[40px] w-full items-center gap-2 rounded-[8px] px-2 text-left text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2 ${selected ? "bg-[#0073df] text-white shadow-[0_3px_8px_rgba(0,115,223,0.22)]" : "text-[#676767] hover:translate-x-0.5 hover:bg-[#f5f7ff] hover:text-[#104170]"}`}
          >
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
      <div className="my-4 border-t border-[#e4eaf8]" />
      <button
        onClick={onDelete}
        className="flex min-h-[40px] w-full items-center gap-2 rounded-[8px] px-2 text-left text-sm font-medium text-[#ef4444] transition hover:bg-[#fff1f2]"
      >
        <Trash2 size={20} strokeWidth={1.8} />
        Delete Account
      </button>
    </nav>
  </aside>
  );
};

export default AccountSettingsNav;
