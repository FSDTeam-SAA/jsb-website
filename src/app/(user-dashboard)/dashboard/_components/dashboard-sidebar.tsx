"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, HelpCircle, LayoutDashboard, LogOut, Search, UserRound } from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Find Leads", href: "/dashboard/find-leads", icon: Search },
  { label: "My Leads", href: "/dashboard/my-leads", icon: FileText },
  { label: "My Orders", href: "/dashboard/my-orders", icon: FileText },
  { label: "Account", href: "/dashboard/account", icon: UserRound },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col overflow-y-auto border-r border-[#e6edf5] bg-white px-3 py-4 lg:flex">
      <Link href="/" className="mb-7 flex h-8 items-center px-1" aria-label="Go to home page">
        <Image src="/images/footer_logo.png" alt="Foreclosure Gold" width={150} height={43} className="h-auto w-[112px]" priority />
      </Link>
      <nav className="space-y-1" aria-label="Dashboard navigation">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active = label === "Dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
          return <Link key={label} href={href} className={`flex h-10 items-center gap-3 rounded-[6px] px-3 text-[13px] transition ${active ? "bg-[#e9f3ff] text-[#0073df]" : "text-[#4b5563] hover:bg-[#f4f8fc]"}`}><Icon size={16} strokeWidth={1.7} />{label}</Link>;
        })}
        <button className="flex h-10 w-full items-center gap-3 rounded-[6px] px-3 text-[13px] text-[#ed2532] transition hover:bg-[#fff1f2]"><LogOut size={16} strokeWidth={1.7} />Logout</button>
      </nav>
      <div className="mt-4 rounded-[10px] border border-[#e4edf5] bg-[#f9fcff] p-3">
        <p className="text-[10px] text-[#7b8794]">Account Balance</p>
        <div className="mt-1 flex items-center justify-between"><p className="text-[16px] font-bold text-[#00a77a]">$425.00</p><Link href="/dashboard/account" className="grid size-6 place-items-center rounded-full bg-[#08b988] text-white" aria-label="Add account funds">+</Link></div>
      </div>
      <div className="mt-auto rounded-[10px] border border-[#e6edf5] bg-[#f7faff] p-3 text-center">
        <HelpCircle className="mx-auto mb-1 text-[#0073df]" size={22} /><p className="text-[11px] font-medium text-[#334155]">Need Help?</p><Link href="#support" className="text-[10px] text-[#0073df] underline">Support Center</Link><span className="px-1 text-[#9ca3af]">|</span><Link href="#contact" className="text-[10px] text-[#0073df] underline">Contact Us</Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
