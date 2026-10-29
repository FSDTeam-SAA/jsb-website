"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const filterGroups = [
  ["Lead Type", ["Foreclosure", "Pre-Foreclosure", "Mortgage", "Bankruptcy", "Tax Lien", "REO / Bank-Owned", "Debt Settlement", "Probate"]],
  ["Geography", ["California (CA)", "Orange County", "Any City", "e.g. 928XXX"]],
  ["Availability", ["Shared", "Exclusive", "Both"]],
  ["Freshness", ["Today", "Last 7 Days", "Last 30 Days", "Custom"]],
  ["Property Filters", ["Property type", "Estimated value", "Estimated equity", "Mortgage balance"]],
  ["Contact Data", ["Has phone", "Has email", "Has both"]],
  ["Price", ["Min", "Max"]],
] as const;

const FindLeadsFilter = () => {
  const [open, setOpen] = useState<string | null>(null);
  return <aside className="hidden w-[172px] shrink-0 border-r border-[#edf1f5] pr-3 lg:block xl:w-[190px]">
    <div className="flex items-center justify-between pb-3"><h2 className="text-[12px] font-bold text-[#17212e]">Filter</h2><button className="text-[9px] text-[#0073df]">Clear All</button></div>
    {filterGroups.map(([title, values]) => <section key={title} className="border-t border-[#eef2f6]"><button onClick={() => setOpen(open === title ? null : title)} className="flex h-9 w-full items-center justify-between text-left text-[10px] font-medium text-[#344054]">{title}<ChevronDown size={13} className={`transition ${open === title ? "rotate-180" : ""}`} /></button>{open === title && <div className="space-y-2 pb-3">{values.map((value, index) => title === "Geography" || title === "Property Filters" || title === "Price" ? <input key={value} placeholder={value} className="h-7 w-full rounded border border-[#d0d5dd] px-2 text-[9px] outline-none" /> : <label key={value} className="flex items-center gap-1.5 text-[9px] text-[#667085]"><input type="checkbox" defaultChecked={title === "Lead Type" && index === 0} className="accent-[#0073df]" />{value}</label>)}</div>}</section>)}
  </aside>;
};

export default FindLeadsFilter;
