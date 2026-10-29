"use client";

import Image from "next/image";
import { Bell, Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import DashboardNotificationPanel from "./dashboard-notification-panel";

const DashboardHeader = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-[75px] shrink-0 items-center justify-between border-b border-[#e6edf5] bg-white px-5 md:px-7">
      <div className="flex items-center gap-3">
        <button className="lg:hidden">
          <Menu size={22} />
        </button>
        <Image
          className="h-auto w-[100px] lg:hidden"
          src="/images/footer_logo.png"
          alt="Foreclosure Gold"
          width={150}
          height={43}
        />
        <h1 className="hidden text-[24px] font-bold text-[#101828] sm:block">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-[#1768ad]" aria-label="Shopping cart">
          <ShoppingCart size={19} strokeWidth={1.7} />
          <span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-[#ed2532]" />
        </button>
        <button
          onClick={() => setNotificationsOpen((open) => !open)}
          className="relative text-[#1768ad]"
          aria-expanded={notificationsOpen}
          aria-label="Open notifications"
        >
          <Bell size={18} strokeWidth={1.7} />
          <span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-[#ed2532]" />
        </button>
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-[#087cf0] text-xs font-bold text-white">
            JD
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-[11px] font-medium text-[#1f2937]">John Doe</p>
            <p className="text-[9px] text-[#d79411]">Gold Member</p>
          </div>
        </div>
      </div>
      {notificationsOpen && <DashboardNotificationPanel onClose={() => setNotificationsOpen(false)} />}
    </header>
  );
};

export default DashboardHeader;
