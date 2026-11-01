"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getCurrentUserProfile } from "@/lib/auth-api";
import DashboardNotificationPanel from "./dashboard-notification-panel";

const DashboardHeader = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const profileQuery = useQuery({
    queryKey: ["user", "profile", accessToken],
    queryFn: () => getCurrentUserProfile(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
  });
  const user = profileQuery.data?.data ?? session?.user;
  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Account";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

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
        <Link
          href="/dashboard/cart"
          className="relative rounded-md p-1 text-[#1768ad] transition hover:bg-[#eef5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] focus-visible:ring-offset-2"
          aria-label="Open shopping cart"
        >
          <ShoppingCart size={19} strokeWidth={1.7} />
          <span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-[#ed2532]" />
        </Link>
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
          <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-[#087cf0] text-xs font-bold text-white">
            {user?.photo ? (
              // Profile image hosts are returned dynamically by the user API.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photo} alt="" className="size-full object-cover" />
            ) : (
              initials
            )}
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="max-w-[120px] truncate text-[11px] font-medium text-[#1f2937]">
              {fullName}
            </p>
            <p className="text-[9px] text-[#d79411]">Gold Member</p>
          </div>
        </div>
      </div>
      {notificationsOpen && (
        <DashboardNotificationPanel
          onClose={() => setNotificationsOpen(false)}
        />
      )}
    </header>
  );
};

export default DashboardHeader;
