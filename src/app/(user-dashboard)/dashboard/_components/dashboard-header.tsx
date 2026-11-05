"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { getCurrentUserProfile, logoutUser } from "@/lib/auth-api";
import { getCart } from "@/lib/cart-api";
import { getUnreadNotificationCount } from "@/lib/notification-api";
import LogoutModal from "@/components/modals/LogoutModal";
import DashboardNotificationPanel from "./dashboard-notification-panel";

const displayCount = (count: number) => (count > 99 ? "99+" : String(count));

const mobileNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Find Leads", href: "/dashboard/find-leads", icon: Search },
  { label: "My Leads", href: "/dashboard/my-leads", icon: FileText },
  { label: "My Orders", href: "/dashboard/my-orders", icon: FileText },
  { label: "Account", href: "/dashboard/account", icon: UserRound },
];

const DashboardHeader = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logoutUser,
    onSettled: async () => {
      queryClient.clear();
      await signOut({ callbackUrl: "/" });
    },
  });
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
  const unreadNotificationsQuery = useQuery({
    queryKey: ["notifications", "unread-count", accessToken],
    queryFn: () => getUnreadNotificationCount(accessToken!),
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
  const unreadNotificationCount =
    unreadNotificationsQuery.data?.data.unreadCount ?? 0;

  return (
    <header className="sticky top-0 z-30 flex h-[75px] shrink-0 items-center justify-between border-b border-[#dbecff] bg-white px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-dashboard-navigation"
          aria-label="Toggle dashboard navigation"
          className="grid size-10 place-items-center rounded-md text-[#104170] transition hover:bg-[#eef5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] lg:hidden"
        >
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Image
          className="h-auto w-[88px] shrink-0 sm:w-[100px] lg:hidden"
          src="/images/footer_logo.png"
          alt="Foreclosure Gold"
          width={150}
          height={43}
        />
        <h1 className="hidden text-[28px] font-bold leading-none text-[#0e1224] sm:block">
          Dashboard
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
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
        <div className="hidden items-center gap-2 rounded-lg sm:flex">
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
          accessToken={accessToken}
          unreadCount={unreadNotificationCount}
          onClose={() => setNotificationsOpen(false)}
        />
      )}
      {mobileNavOpen && (
        <nav
          id="mobile-dashboard-navigation"
          aria-label="Dashboard navigation"
          className="fixed inset-x-0 top-[75px] z-40 border-b border-[#dbecff] bg-white p-4 shadow-[0_10px_24px_rgba(16,65,112,0.14)] lg:hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            {mobileNavigation.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileNavOpen(false)}
                className="flex min-h-11 items-center gap-2 rounded-lg border border-[#e4edf5] px-3 text-sm font-medium text-[#104170] transition hover:bg-[#eef5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7]"
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileNavOpen(false);
              setLogoutModalOpen(true);
            }}
            className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#fecaca] bg-[#fff7f7] px-3 text-sm font-semibold text-[#d92d20] transition hover:bg-[#fff0f1] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d92d20]"
          >
            <LogOut size={17} />
            Logout
          </button>
        </nav>
      )}
      <LogoutModal
        isOpen={logoutModalOpen}
        isPending={logoutMutation.isPending}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
      />
    </header>
  );
};

export default DashboardHeader;
