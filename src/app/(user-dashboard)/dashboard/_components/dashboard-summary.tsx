"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleDollarSign,
  Crown,
  FileText,
  Plus,
  Search,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getUserDashboardOverview } from "@/lib/dashboard-api";
import AddFundsModal from "./add-funds-modal";

const actions = [
  {
    label: "Find Leads",
    detail: "Browse thousands of foreclosure leads",
    icon: Search,
    href: "/dashboard/find-leads",
    className: "bg-[#087ce7] text-white",
  },
  {
    label: "My Leads",
    detail: "View and manage your purchased leads",
    icon: FileText,
    href: "/dashboard/my-leads",
    className: "bg-white text-[#17212e]",
  },
];

const DashboardSummary = () => {
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const overviewQuery = useQuery({
    queryKey: ["dashboard", "user-overview", accessToken],
    queryFn: () => getUserDashboardOverview(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 30_000,
  });
  const overviewCards = overviewQuery.data?.data.overviewCards;
  const currency = overviewCards?.accountBalance.currency ?? "USD";
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  const metrics = [
    {
      label: "Current Membership",
      value: overviewCards?.membership.planName ?? "—",
      detail: overviewCards ? `${overviewCards.membership.discountPercentage}% Lead Discount` : "",
      icon: Crown,
      iconClass: "bg-[#fff5dd] text-[#d69b00]",
      href: "/dashboard/account/subscription-plan",
      cardClass: "border-[#f8e5c1] bg-[#fffcf5] hover:border-[#e5ba6e]",
    },
    {
      label: "Account Balance",
      value: overviewCards ? formatCurrency(overviewCards.accountBalance.currentBalance) : "—",
      detail: "",
      icon: BriefcaseBusiness,
      iconClass: "bg-[#e7f2ff] text-[#0073df]",
      cardClass: "border-[#ebf4ff] bg-white hover:border-[#b9dafa]",
    },
    {
      label: "Purchased Leads",
      value: overviewCards?.leads.totalPurchased.toLocaleString() ?? "—",
      detail: "",
      icon: CircleDollarSign,
      iconClass: "bg-[#e7fbf2] text-[#00a77a]",
      href: "/dashboard/my-leads",
      cardClass: "border-[#ebf4ff] bg-white hover:border-[#b9dafa]",
    },
  ];
  return (
    <>
      <section className="grid gap-3 lg:grid-cols-3">
        {metrics.map(({ label, value, detail, icon: Icon, iconClass, href, cardClass }) => {
          const className = `group flex h-[100px] min-w-0 w-full items-center justify-between gap-2 rounded-[8px] border px-4 text-left transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5 ${cardClass}`;
          const content = (
            <>
              <span className="flex min-w-0 items-center gap-4">
                <span className={`grid size-[68px] shrink-0 place-items-center rounded-full ${iconClass}`}>
                  <Icon aria-hidden="true" size={29} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-[#333]">{label}</span>
                  {status === "loading" || overviewQuery.isLoading ? (
                    <span aria-hidden="true" className="mt-1 block h-5 w-20 animate-pulse rounded bg-[#edf2f7]" />
                  ) : (
                    <span className="mt-1 block text-lg font-bold leading-none text-black">{value}</span>
                  )}
                  {detail && (
                    <span className="mt-1 block text-xs font-medium leading-none text-[#734300]">{detail}</span>
                  )}
                </span>
              </span>
              <ArrowRight aria-hidden="true" size={18} className="shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
            </>
          );

          return href ? (
            <Link key={label} href={href} className={className}>
              {content}
            </Link>
          ) : (
            <button key={label} type="button" aria-haspopup="dialog" onClick={() => setAddFundsOpen(true)} className={className}>
              {content}
            </button>
          );
        })}
      </section>
      {overviewQuery.isError && <p role="alert" className="mt-2 text-xs text-[#d92d20]">Dashboard summary could not be loaded. <button type="button" onClick={() => overviewQuery.refetch()} className="font-semibold underline">Try again</button></p>}
      <section className="mt-3 grid gap-3 lg:grid-cols-3">
        {actions.map(({ label, detail, icon: Icon, href, className }) => (
          <Link
            key={label}
            href={href}
            className={`flex h-20 items-center justify-between rounded-[8px] px-4 transition hover:-translate-y-0.5 ${className}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`grid size-12 place-items-center rounded-full ${label === "Find Leads" ? "bg-white/20" : "bg-[#e7f2ff] text-[#0073df]"}`}
              >
                <Icon size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-bold leading-none">
                  {label}
                </p>
                <p
                  className={`mt-1 text-xs ${label === "Find Leads" ? "text-white" : "text-[#333]"}`}
                >
                  {detail}
                </p>
              </div>
            </div>
            <ArrowRight size={18} />
          </Link>
        ))}
        <button
          onClick={() => setAddFundsOpen(true)}
          className="flex h-20 items-center justify-between rounded-[8px] bg-gradient-to-r from-[#03a87b] to-[#08bf91] px-4 text-left text-white transition hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-white/20">
              <Plus size={25} />
            </span>
            <div>
              <p className="text-lg font-bold leading-none">Add Funds</p>
              <p className="mt-1 text-xs">Add money to your account balance</p>
            </div>
          </div>
          <ArrowRight size={18} />
        </button>
      </section>
      <AddFundsModal
        open={addFundsOpen}
        onClose={() => setAddFundsOpen(false)}
      />
    </>
  );
};

export default DashboardSummary;
