"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import {
  FileText,
  Headphones,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import LogoutModal from "@/components/modals/LogoutModal";
import { logoutUser } from "@/lib/auth-api";
import { getWalletBalance } from "@/lib/wallet-api";
import AddFundsModal from "./add-funds-modal";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Find Leads", href: "/dashboard/find-leads", icon: Search },
  { label: "My Leads", href: "/dashboard/my-leads", icon: FileText },
  { label: "My Orders", href: "/dashboard/my-orders", icon: FileText },
  { label: "Account", href: "/dashboard/account", icon: UserRound },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const logoutMutation = useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logoutUser,
    onSettled: async () => {
      queryClient.clear();
      await signOut({ callbackUrl: "/" });
    },
  });
  const walletBalanceQuery = useQuery({
    queryKey: ["wallet", "balance", accessToken],
    queryFn: () => getWalletBalance(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 30_000,
  });
  const formattedBalance = walletBalanceQuery.data?.data.formattedBalance;

  return (
    <aside data-lenis-prevent className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col overflow-y-auto border-r border-[#dbecff] bg-white lg:flex">
      <Link
        href="/"
        className="flex h-[75px] shrink-0 items-center border-b border-[#dbecff] px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#104170]"
        aria-label="Go to home page"
      >
        <Image
          src="/images/footer_logo.png"
          alt="Foreclosure Gold"
          width={165}
          height={42}
          className="h-auto w-[165px]"
          priority
        />
      </Link>
      <nav className="space-y-2 px-4 pt-4" aria-label="Dashboard navigation">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active =
            label === "Dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex h-10 items-center gap-3 rounded-[8px] px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2 ${active ? "bg-[#dfefff] text-[#0073df]" : "text-[#545454] hover:bg-[#f4f8fc] hover:text-[#104170]"}`}
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="mt-1 flex h-10 w-full items-center gap-3 rounded-[8px] px-3 text-sm font-medium text-[#ed2532] transition hover:bg-[#fff1f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2532] focus-visible:ring-offset-2"
        >
          <LogOut size={16} strokeWidth={1.9} />
          Logout
        </button>
      </nav>
      <button
        type="button"
        onClick={() => setAddFundsOpen(true)}
        className="group mx-4 mt-4 rounded-2xl border border-[#e4edf5] bg-white px-4 py-3 text-left shadow-[0_3px_8px_rgba(42,83,120,0.12)] transition hover:-translate-y-0.5 hover:border-[#b9d9f6] hover:shadow-[0_7px_16px_rgba(42,83,120,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2"
        aria-label="Add funds to your account balance"
      >
        <p className="text-xs font-medium text-[#737b84]">Account Balance</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xl font-bold leading-none text-[#00a77a]" aria-live="polite">
            {walletBalanceQuery.isLoading ? <span className="inline-block h-6 w-20 animate-pulse rounded bg-[#d9f4eb]" /> : walletBalanceQuery.isError ? <span className="text-sm text-[#b42318]">Unavailable</span> : formattedBalance ?? "—"}
          </p>
          <span className="grid size-8 place-items-center rounded-full bg-[#08b988] text-white transition group-hover:bg-[#079a72]">
            <Plus aria-hidden="true" size={20} strokeWidth={2.5} />
          </span>
        </div>
      </button>
      <div className="mx-4 mb-4 mt-auto flex items-center gap-3 rounded-2xl border border-[#e4edf5] bg-[#f5f8ff] p-3 shadow-[0_3px_8px_rgba(42,83,120,0.1)]">
        <Headphones className="shrink-0 text-[#0073df]" size={32} strokeWidth={1.8} />
        <div className="min-w-0">
          <p className="text-xs font-bold leading-none text-[#252f3a]">Need Help?</p>
          <Link href="/dashboard/account/contact-support" className="mt-1 block text-[10px] leading-normal text-[#0073df] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]">
            Support Center<br />Contact Us
          </Link>
        </div>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        isPending={logoutMutation.isPending}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
      />
      <AddFundsModal open={addFundsOpen} onClose={() => setAddFundsOpen(false)} />
    </aside>
  );
};

export default DashboardSidebar;
