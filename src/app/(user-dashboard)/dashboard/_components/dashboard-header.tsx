"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getCurrentUserProfile } from "@/lib/auth-api";
import { getCart } from "@/lib/cart-api";
import DashboardNotificationPanel, {
  unreadNotificationCount,
} from "./dashboard-notification-panel";

const displayCount = (count: number) => (count > 99 ? "99+" : String(count));

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
  const cartQuery = useQuery({
    queryKey: ["cart", accessToken],
    queryFn: () => getCart(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
  const user = profileQuery.data?.data ?? session?.user;
  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Account";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";
  const cartCount = cartQuery.data?.data.summary.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-30 flex h-[75px] shrink-0 items-center justify-between border-b border-[#dbecff] bg-white px-4 md:px-6">
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
        <h1 className="hidden text-[32px] font-bold leading-none text-[#0e1224] sm:block">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/cart"
          className="relative grid size-10 place-items-center rounded-md text-[#104170] transition hover:bg-[#eef5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] focus-visible:ring-offset-2"
          aria-label={`Open shopping cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          title={`${cartCount} item${cartCount === 1 ? "" : "s"} in cart`}
        >
          <ShoppingCart size={28} strokeWidth={1.7} />
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-[#c20000] px-1 text-[10px] font-bold leading-none text-white">
            {displayCount(cartCount)}
          </span>
        </Link>
        <button
          onClick={() => setNotificationsOpen((open) => !open)}
          className="relative grid size-10 place-items-center rounded-md text-[#104170] transition hover:bg-[#eef5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] focus-visible:ring-offset-2"
          aria-expanded={notificationsOpen}
          aria-label={`Open notifications, ${unreadNotificationCount} unread`}
          title={`${unreadNotificationCount} unread notification${unreadNotificationCount === 1 ? "" : "s"}`}
        >
          <Bell size={28} strokeWidth={1.7} />
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-[#c20000] px-1 text-[10px] font-bold leading-none text-white">
            {displayCount(unreadNotificationCount)}
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-lg">
          <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-[#157afb] text-base font-medium text-white">
            {user?.photo ? (
              // Profile image hosts are returned dynamically by the user API.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photo} alt="" className="size-full object-cover" />
            ) : (
              initials
            )}
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="max-w-[120px] truncate text-sm font-medium text-[#0e1224]">
              {fullName}
            </p>
            <p className="text-xs text-[#b58400]">Gold Member</p>
          </div>
          <ChevronDown className="hidden text-[#0e1224] sm:block" size={16} strokeWidth={1.8} />
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
