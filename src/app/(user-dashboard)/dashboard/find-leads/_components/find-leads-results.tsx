"use client";

import { ChevronDown, Search, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

const leads = [
  ["Foreclosure", "Orange County, CA 928xx", "Single Family", "$685,000", "$240,000", "3 days ago", "Shared", "$25.00"],
  ["Pre-Foreclosure", "San Diego, CA 921xx", "Townhouse", "$500,000", "$175,000", "5 days ago", "Shared", "$20.00"],
  ["Tax Lien", "Orange County, CA 928xx", "Single Family", "$685,000", "$240,000", "3 days ago", "Shared", "$25.00"],
  ["Foreclosure", "Sacramento, CA 958xx", "Multi-Family", "$750,000", "$300,000", "2 weeks ago", "Exclusive", "$40.00"],
  ["Pre-Foreclosure", "Los Angeles, CA 900xx", "Condo", "$450,000", "$150,000", "1 week ago", "Exclusive", "$30.00"],
  ["Tax Lien", "Fresno, CA 937xx", "Condo", "$325,000", "$100,000", "1 day ago", "Shared", "$15.00"],
  ["Bankruptcy", "Fresno, CA 937xx", "Condo", "$325,000", "$100,000", "1 day ago", "Exclusive", "$15.00"],
  ["Pre-Foreclosure", "Fresno, CA 937xx", "Condo", "$325,000", "$100,000", "1 day ago", "Exclusive", "$15.00"],
  ["Bankruptcy", "Fresno, CA 937xx", "Condo", "$325,000", "$100,000", "1 day ago", "Shared", "$15.00"],
  ["REO/Bank-Owned", "Irvine, CA 926xx", "Single Family", "$900,000", "$400,000", "10 days ago", "Shared", "$35.00"],
];
const leadTag: Record<string, string> = { Foreclosure: "bg-[#ffe9ed] text-[#fb5570]", "Pre-Foreclosure": "bg-[#fff2dd] text-[#ca8a04]", "Tax Lien": "bg-[#f3eaff] text-[#a855f7]", Bankruptcy: "bg-[#dff8f7] text-[#0ca59f]", "REO/Bank-Owned": "bg-[#eee8ff] text-[#6d42d8]" };

const FindLeadsResults = ({ onBulkOrder }: { onBulkOrder: () => void }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const results = useMemo(() => leads.filter((lead) => lead.join(" ").toLowerCase().includes(query.toLowerCase())), [query]);
  const toggle = (index: number) => setSelected((current) => current.includes(index) ? current.filter((value) => value !== index) : [...current, index]);
  return <div className="min-w-0 flex-1">
    <div className="mt-4 flex flex-wrap gap-2"><div className="relative min-w-[230px] flex-1 max-w-[335px]"><Search size={13} className="absolute left-2 top-2 text-[#98a2b3]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search city, county or zip..." className="h-8 w-full rounded-[4px] border border-[#d0d5dd] pl-7 pr-2 text-[9px] outline-none focus:border-[#087ce7]" /></div><button className="flex h-8 items-center gap-1 rounded-[4px] border border-[#d0d5dd] px-2 text-[9px]"><span className="grid size-3 grid-cols-2 gap-px"><i className="bg-[#98a2b3]" /><i className="bg-[#98a2b3]" /><i className="bg-[#98a2b3]" /><i className="bg-[#98a2b3]" /></span>Newest Leads<ChevronDown size={12} /></button><div className="ml-auto flex gap-2"><button className="h-8 rounded-[4px] border border-[#087ce7] px-3 text-[10px] text-[#087ce7]">⌑ &nbsp; Save Search</button><button onClick={onBulkOrder} className="h-8 rounded-[4px] border border-[#00aa7a] px-3 text-[10px] text-[#00a77a]">＋ &nbsp; Make Bulk Order</button></div></div>
    <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[820px] text-left text-[9px]"><thead className="bg-[#fafcff] text-[#98a2b3]"><tr>{["", "Lead Type", "Location", "Property Type", "Est.Value", "Est.Equity", "Added", "Availability", "Price", "Action"].map((title) => <th key={title} className="px-2 py-3 font-medium">{title}</th>)}</tr></thead><tbody>{results.concat(results).slice(0, 14).map((lead, index) => <tr key={`${lead[0]}-${index}`} className="border-b border-[#eff2f5] text-[#475467]"><td className="px-2 py-2"><input type="checkbox" checked={selected.includes(index)} onChange={() => toggle(index)} className="accent-[#087ce7]" /></td><td className="px-2 py-2"><span className={`rounded px-1.5 py-1 ${leadTag[lead[0]]}`}>{lead[0]}</span></td>{lead.slice(1, 7).map((value, column) => <td key={column} className="max-w-[95px] px-2 py-2">{value}</td>)}<td className="px-2 py-2"><span className={`rounded px-1.5 py-1 ${lead[7] === "Exclusive" ? "bg-[#ddf9e8] text-[#10a44c]" : "bg-[#e4f4ff] text-[#087ce7]"}`}>{lead[7]}</span></td><td className="px-2 py-2">{lead[8]}</td><td className="px-2 py-2"><button className="rounded border border-[#8dc7ff] px-1.5 py-1 text-[#087ce7]">View Lead</button></td></tr>)}</tbody></table></div>
    {selected.length > 0 && <div className="sticky bottom-3 mt-3 flex items-center justify-between rounded-[10px] border border-[#d5dce5] bg-white p-3 shadow-lg"><p className="text-[16px] font-medium text-[#344054]">{selected.length} Leads Selected</p><p className="hidden text-[10px] text-[#0073df] sm:block">2 Shared Lead &nbsp;•&nbsp; 2 Exclusive Lead</p><button className="flex h-8 items-center gap-2 rounded-[4px] bg-[#087ce7] px-8 text-[10px] text-white">Add to Cart <ShoppingCart size={13} /></button></div>}
    <div className="mt-3 flex items-center justify-between text-[9px] text-[#98a2b3]"><span>Showing 1-25 of 4,827 Matching Leads</span><div className="flex gap-2"><button className="rounded border border-[#8dc7ff] px-2 py-1 text-[#087ce7]">25</button><button>50</button><button>100</button></div></div>
  </div>;
};

export default FindLeadsResults;
