"use client";

import { ChevronDown, Filter, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const leads = [
  ["Foreclosure", "Orange County, CA 928xx", "Single Family", "$665,000", "$240,000", "3 days ago", "Shared", "$25.00"],
  ["Pre-Foreclosure", "San Diego County, CA 921xx", "Townhouse", "$500,000", "$170,000", "5 days ago", "Shared", "$30.00"],
  ["Tax Lien", "Orange County, CA 928xx", "Single Family", "$325,000", "$130,000", "3 days ago", "Shared", "$25.00"],
  ["Foreclosure", "Sacramento, CA 958xx", "Multi-Family", "$750,000", "$530,000", "2 weeks ago", "Exclusive", "$40.00"],
  ["Pre-Foreclosure", "Los Angeles, CA 900xx", "Condo", "$450,000", "$190,000", "1 week ago", "Exclusive", "$30.00"],
  ["Tax Lien", "Fresno, CA 937xx", "Condo", "$325,000", "$110,000", "1 day ago", "Exclusive", "$15.00"],
  ["Bankruptcy", "Fresno, CA 937xx", "Condo", "$825,000", "$390,000", "1 day ago", "Exclusive", "$15.00"],
  ["REO/Bank-Owned", "Irvine, CA 926xx", "Single Family", "$900,000", "$400,000", "10 days ago", "Shared", "$25.00"],
];
const tags: Record<string, string> = { Foreclosure: "bg-[#ffe9ed] text-[#fb5570]", "Pre-Foreclosure": "bg-[#fff2dd] text-[#ca8a04]", "Tax Lien": "bg-[#f4e9ff] text-[#a855f7]", Bankruptcy: "bg-[#dff8f7] text-[#09a6a0]", "REO/Bank-Owned": "bg-[#eee8ff] text-[#6d42d8]" };

const DashboardMarketplace = () => {
  const [search, setSearch] = useState("");
  const filteredLeads = leads.filter((lead) => lead.join(" ").toLowerCase().includes(search.toLowerCase()));
  return <section className="mt-4 overflow-hidden rounded-[8px] bg-white p-3 shadow-[0_2px_10px_rgba(31,61,96,0.04)]">
    <div className="flex flex-col justify-between gap-3 border-b border-[#edf1f5] pb-3 lg:flex-row lg:items-center"><div><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-[#e7f2ff] text-[#087ce7]"><Search size={18} /></span><h2 className="text-[16px] font-bold text-[#17212e]">Find Leads Marketplace</h2></div><p className="mt-1 text-[10px] text-[#667085]">Search and filter thousands of foreclosure and distressed property leads nationwide.</p></div><button className="h-8 rounded-[5px] border border-[#0073df] px-4 text-[11px] text-[#0073df]">⌑ &nbsp; Save Search</button></div>
    <div className="mt-3 grid gap-3 lg:grid-cols-[226px_1fr]"><aside className="hidden border-r border-[#edf1f5] pr-3 lg:block"><div className="flex items-center justify-between"><h3 className="text-[12px] font-bold">Filter</h3><button className="text-[10px] text-[#0073df]">Clear All</button></div>{["Lead Type", "Geography", "Availability", "Freshness", "Property Filters", "Contact Data", "Price"].map((label, index) => <div key={label} className="border-b border-[#edf1f5] py-3"><div className="flex justify-between text-[11px] font-medium text-[#344054]">{label}<ChevronDown size={13} /></div>{index < 3 && <div className="mt-2 space-y-1.5 text-[10px] text-[#667085]">{index === 0 ? ["Foreclosure", "Pre-Foreclosure", "Mortgage", "Bankruptcy", "Tax Lien", "REO / Bank-Owned"].map((item, itemIndex) => <label key={item} className="flex gap-1.5"><input defaultChecked={itemIndex === 0} type="checkbox" className="accent-[#0073df]" />{item}</label>) : <><select className="h-7 w-full rounded border border-[#d0d5dd] px-1 text-[9px]"><option>{index === 1 ? "California (CA)" : "Shared"}</option></select><select className="h-7 w-full rounded border border-[#d0d5dd] px-1 text-[9px]"><option>{index === 1 ? "Orange County" : "Exclusive"}</option></select></>}</div>}</div>)}<button className="h-8 w-full rounded-[4px] bg-[#087ce7] text-[11px] text-white">Apply</button></aside>
      <div className="min-w-0"><div className="flex gap-2"><div className="relative flex-1"><Search size={14} className="absolute left-2 top-2 text-[#98a2b3]" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-8 w-full rounded-[5px] border border-[#d0d5dd] pl-7 pr-2 text-[10px] outline-none focus:border-[#0073df]" placeholder="Search city, county or zip..." /></div><button className="flex h-8 items-center gap-1 rounded-[5px] border border-[#d0d5dd] px-2 text-[10px]"><SlidersHorizontal size={12} />Newest Leads<ChevronDown size={12} /></button><button className="lg:hidden grid size-8 place-items-center rounded border border-[#d0d5dd]"><Filter size={14} /></button></div>
        <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-[9px]"><thead className="bg-[#fafcff] text-[#98a2b3]"><tr>{["", "Lead Type", "Location", "Property Type", "Est. Value", "Est. Equity", "Added", "Availability", "Price", "Action"].map((head) => <th key={head} className="px-2 py-3 font-medium">{head}</th>)}</tr></thead><tbody>{filteredLeads.concat(filteredLeads).slice(0, 18).map((lead, index) => <tr key={`${lead[0]}-${index}`} className="border-b border-[#f0f2f5] text-[#475467]"><td className="px-2 py-2.5"><input type="checkbox" /></td><td className="px-2 py-2.5"><span className={`rounded px-1.5 py-1 ${tags[lead[0]]}`}>{lead[0]}</span></td>{lead.slice(1, 7).map((value, cell) => <td key={cell} className="max-w-[86px] px-2 py-2.5">{value}</td>)}<td className="px-2 py-2.5"><span className={`rounded px-1.5 py-1 ${lead[7] === "Exclusive" ? "bg-[#ddf9e8] text-[#10a44c]" : "bg-[#e4f4ff] text-[#087ce7]"}`}>{lead[7]}</span></td><td className="px-2 py-2.5">{lead[8]}</td><td className="px-2 py-2.5"><button className="rounded border border-[#8dc7ff] px-1.5 py-1 text-[#087ce7]">View Lead</button></td></tr>)}</tbody></table></div></div></div>
  </section>;
};

export default DashboardMarketplace;
