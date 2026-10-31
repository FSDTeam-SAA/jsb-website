"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
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

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Find Leads", href: "/dashboard/find-leads", icon: Search },
  { label: "My Leads", href: "/dashboard/my-leads", icon: FileText },
  { label: "My Orders", href: "/dashboard/my-orders", icon: FileText },
  { label: "Account", href: "/dashboard/account", icon: UserRound },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const logoutMutation = useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logoutUser,
    onSettled: async () => {
      queryClient.clear();
      await signOut({ callbackUrl: "/" });
    },
  });

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col overflow-y-auto border-r border-[#dce6f0] bg-white lg:flex">
      <Link
        href="/"
        className="flex h-[86px] shrink-0 items-center border-b border-[#dce6f0] px-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#104170]"
        aria-label="Go to home page"
      >
        <Image
          src="/images/footer_logo.png"
          alt="Foreclosure Gold"
          width={228}
          height={58}
          className="h-auto w-[196px]"
          priority
        />
      </Link>
      <nav className="space-y-2 px-[17px] pt-5" aria-label="Dashboard navigation">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active =
            label === "Dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex h-[50px] items-center gap-4 rounded-[8px] px-4 text-[18px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2 ${active ? "bg-[#dfefff] text-[#0073df]" : "text-[#656565] hover:bg-[#f4f8fc] hover:text-[#104170]"}`}
            >
              <Icon size={20} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="mt-1 flex h-[50px] w-full items-center gap-4 rounded-[8px] px-4 text-[18px] font-medium text-[#ed2532] transition hover:bg-[#fff1f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ed2532] focus-visible:ring-offset-2"
        >
          <LogOut size={20} strokeWidth={1.9} />
          Logout
        </button>
      </nav>
      <div className="mx-[17px] mt-6 rounded-[18px] border border-[#e4edf5] bg-white px-5 py-4 shadow-[0_3px_8px_rgba(42,83,120,0.12)]">
        <p className="text-[14px] font-medium text-[#737b84]">Account Balance</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-[24px] font-bold leading-none text-[#00a77a]">$425.00</p>
          <Link
            href="/dashboard/account"
            className="grid size-9 place-items-center rounded-full bg-[#08b988] text-white transition hover:bg-[#079a72] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a77a] focus-visible:ring-offset-2"
            aria-label="Add account funds"
          >
            <Plus aria-hidden="true" size={24} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
      <div className="mx-[17px] mb-4 mt-auto flex items-center gap-4 rounded-[18px] border border-[#e4edf5] bg-[#f5f8ff] p-5 shadow-[0_3px_8px_rgba(42,83,120,0.1)]">
        <Headphones className="shrink-0 text-[#0073df]" size={39} strokeWidth={1.8} />
        <div className="min-w-0">
          <p className="text-[14px] font-bold leading-none text-[#252f3a]">Need Help?</p>
          <Link href="#support" className="mt-2 block text-[12px] leading-none text-[#0073df] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]">
            Support Center
          </Link>
          <Link href="#contact" className="mt-2 block text-[12px] leading-none text-[#0073df] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]">
            Contact Us
          </Link>
        </div>
      </div>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        isPending={logoutMutation.isPending}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
      />
    </aside>
  );
};

export default DashboardSidebar;
