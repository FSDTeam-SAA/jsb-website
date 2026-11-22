"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  Bell,
  ChevronDown,
  CreditCard,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardNotificationPanel from "./dashboard-notification-panel";

const displayCount = (count: number) => (count > 99 ? "99+" : String(count));
const accountMenuLinkClass =
  "flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-[#104170] outline-none data-[highlighted]:bg-[#eef5ff]";

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
  const profile = profileQuery.data?.data;
  const user = profile ?? session?.user;
  const fullName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Account";
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";
  const membershipLabel =
    profile?.activeSubscription?.planName ??
    profile?.activeSubscribe?.planName ??
    "Free Member";
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
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) setMobileNavOpen(false);
          }}
        >
          <DropdownMenuTrigger
            type="button"
            aria-label={`Account menu for ${fullName}`}
            className="group flex items-center gap-1 rounded-lg p-1 text-left transition hover:bg-[#eef5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] sm:gap-2"
          >
            <span aria-hidden="true" className="grid size-8 place-items-center overflow-hidden rounded-full bg-[#157afb] text-base font-medium text-white sm:size-10">
              {user?.photo ? (
                // Profile image hosts are returned dynamically by the user API.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photo} alt="" className="size-full object-cover" />
              ) : (
                initials
              )}
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block max-w-[120px] truncate text-sm font-medium text-[#0e1224]">
                {fullName}
              </span>
              <span className="block max-w-[120px] truncate text-xs text-[#b58400]">
                {membershipLabel}
              </span>
            </span>
            <ChevronDown aria-hidden="true" className="text-[#0e1224] motion-safe:transition-transform group-aria-expanded:rotate-180" size={16} strokeWidth={1.8} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-48 border border-[#dbecff] bg-white p-1.5">
            <MenuPrimitive.LinkItem render={<Link href="/dashboard/account/profile" />} className={accountMenuLinkClass}>
              <UserRound aria-hidden="true" size={16} />
              Profile
            </MenuPrimitive.LinkItem>
            <MenuPrimitive.LinkItem render={<Link href="/dashboard/account/subscription-plan" />} className={accountMenuLinkClass}>
              <CreditCard aria-hidden="true" size={16} />
              Subscription Plan
            </MenuPrimitive.LinkItem>
            <DropdownMenuSeparator />
            <MenuPrimitive.Item
              onClick={() => setLogoutModalOpen(true)}
              className="flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-medium text-[#ed2532] outline-none transition hover:bg-[#fff1f2] data-[highlighted]:bg-[#fff1f2]"
            >
              <LogOut aria-hidden="true" size={16} strokeWidth={1.9} />
              Logout
            </MenuPrimitive.Item>
          </DropdownMenuContent>
        </DropdownMenu>
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
