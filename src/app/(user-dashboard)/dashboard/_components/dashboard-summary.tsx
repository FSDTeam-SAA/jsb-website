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
import { useState } from "react";
import AddFundsModal from "./add-funds-modal";

const metrics = [
  {
    label: "Current Membership",
    value: "Gold Member",
    detail: "10% Lead Discount",
    icon: Crown,
    iconClass: "bg-[#fff5dd] text-[#d69b00]",
  },
  {
    label: "Account Balance",
    value: "$425.00",
    detail: "",
    icon: BriefcaseBusiness,
    iconClass: "bg-[#e7f2ff] text-[#0073df]",
  },
  {
    label: "Purchased Leads",
    value: "57",
    detail: "",
    icon: CircleDollarSign,
    iconClass: "bg-[#e7fbf2] text-[#00a77a]",
  },
];
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
  return (
    <>
      <section className="grid gap-3 lg:grid-cols-3">
        {metrics.map(({ label, value, detail, icon: Icon, iconClass }) => (
          <article
            key={label}
            className={`flex h-[100px] items-center justify-between rounded-[8px] border px-4 ${label === "Current Membership" ? "border-[#f8e5c1] bg-[#fffcf5]" : "border-[#ebf4ff] bg-[#fefefe]"}`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`grid size-[68px] place-items-center rounded-full ${iconClass}`}
              >
                <Icon size={29} />
              </span>
              <div>
                <p className="text-xs font-medium text-[#333]">{label}</p>
                <p className="mt-1 text-xl font-bold leading-none text-black">
                  {value}
                </p>
                {detail && (
                  <p className="mt-1 text-xs font-medium leading-none text-[#734300]">{detail}</p>
                )}
              </div>
            </div>
            <ArrowRight size={18} />
          </article>
        ))}
      </section>
      <section className="mt-3 grid gap-3 lg:grid-cols-3">
        {actions.map(({ label, detail, icon: Icon, href, className }) => (
          <Link
            key={label}
            href={href}
            className={`flex h-20 items-center justify-between rounded-[8px] px-4 transition hover:-translate-y-0.5 ${className}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid size-12 place-items-center rounded-full ${label === "Find Leads" ? "bg-white/20" : "bg-[#e7f2ff] text-[#0073df]"}`}
              >
                <Icon size={20} />
              </span>
              <div>
                <p className="text-xl font-bold leading-none">{label}</p>
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
              <p className="text-xl font-bold leading-none">Add Funds</p>
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
