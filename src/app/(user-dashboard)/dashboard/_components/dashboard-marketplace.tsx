"use client";

import { ChevronDown, Filter, Goal, Search, SlidersHorizontal } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

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

type FilterSection =
  | "leadType"
  | "geography"
  | "availability"
  | "freshness"
  | "propertyFilters"
  | "contactData"
  | "price";

const sortOptions = [
  "Newest Leads",
  "Oldest",
  "Price Low → High",
  "Price High → Low",
  "Location",
  "Shared / Exclusive",
] as const;

type SortOption = (typeof sortOptions)[number];

const asPrice = (value: string) => Number(value.replace(/[^0-9.]/g, ""));

const FilterAccordion = ({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: FilterSection;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) => (
  <section className="border-t border-[#edf1f5] py-3">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`${id}-filter-content`}
      className="flex w-full items-center justify-between rounded text-left text-xs font-bold text-[#344054] outline-none transition hover:text-[#0073df] focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2"
    >
      {title}
      <ChevronDown
        size={14}
        className={`transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
        aria-hidden="true"
      />
    </button>
    <div id={`${id}-filter-content`} hidden={!open}>
      {children}
    </div>
  </section>
);

const DashboardMarketplace = () => {
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("Newest Leads");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [openFilters, setOpenFilters] = useState<Record<FilterSection, boolean>>({
    leadType: true,
    geography: true,
    availability: true,
    freshness: true,
    propertyFilters: true,
    contactData: true,
    price: true,
  });
  const filteredLeads = leads.filter((lead) => lead.join(" ").toLowerCase().includes(search.toLowerCase()));
  const sortedLeads = [...filteredLeads].sort((first, second) => {
    if (sortOption === "Oldest") return leads.indexOf(second) - leads.indexOf(first);
    if (sortOption === "Price Low → High") return asPrice(first[7]) - asPrice(second[7]);
    if (sortOption === "Price High → Low") return asPrice(second[7]) - asPrice(first[7]);
    if (sortOption === "Location") return first[1].localeCompare(second[1]);
    if (sortOption === "Shared / Exclusive") {
      if (first[6] === second[6]) return 0;
      return first[6] === "Shared" ? -1 : 1;
    }
    return 0;
  });
  const displayedLeads = Array.from(
    { length: sortedLeads.length ? 25 : 0 },
    (_, index) => sortedLeads[index % sortedLeads.length],
  );
  const toggleFilter = (filter: FilterSection) => {
    setOpenFilters((current) => ({ ...current, [filter]: !current[filter] }));
  };

  useEffect(() => {
    const closeSortOnOutsideClick = (event: MouseEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) setSortOpen(false);
    };
    const closeSortOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSortOpen(false);
    };

    document.addEventListener("mousedown", closeSortOnOutsideClick);
    document.addEventListener("keydown", closeSortOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeSortOnOutsideClick);
      document.removeEventListener("keydown", closeSortOnEscape);
    };
  }, []);

  return <section className="mt-4 overflow-hidden rounded-2xl border border-[#ebf4ff] bg-white shadow-[0_2px_10px_rgba(31,61,96,0.04)]">
    <div className="flex flex-col justify-between gap-3 border-b border-[#edf1f5] px-4 py-3 lg:flex-row lg:items-center"><div><div className="flex items-center gap-3"><Goal size={28} className="shrink-0 text-[#087ce7]" strokeWidth={2.25} /><h2 className="text-xl font-bold text-[#17212e]">Find Leads Marketplace</h2></div><p className="mt-1 text-xs text-[#333]">Search and filter thousands of foreclosure, pre foreclosure and distressed property leads nationwide.</p></div><button className="h-8 rounded-[5px] border border-[#0073df] px-3 text-xs text-[#0073df]">⌑ &nbsp; Save Search</button></div>
    <div className="grid lg:grid-cols-[288px_minmax(0,1fr)]"><aside className="hidden border-r border-[#edf1f5] p-4 lg:block"><div className="flex items-center justify-between pb-3"><h3 className="text-sm font-bold">Filter</h3><button className="text-xs text-[#0073df]">Clear All</button></div>
      <FilterAccordion id="leadType" title="Lead Type" open={openFilters.leadType} onToggle={() => toggleFilter("leadType")}><div className="mt-2 space-y-1.5 text-xs text-[#667085]">{["Foreclosure", "Pre-Foreclosure", "Mortgage", "Bankruptcy", "Tax Lien", "REO / Bank-Owned", "Debt Settlement", "Probate"].map((item, index) => <label key={item} className="flex items-center gap-1.5"><input defaultChecked={index === 0} type="checkbox" className="accent-[#0073df]" />{item}</label>)}</div></FilterAccordion>
      <FilterAccordion id="geography" title="Geography" open={openFilters.geography} onToggle={() => toggleFilter("geography")}><div className="mt-3 space-y-2 text-[11px] text-[#667085]"><label className="block">State<select className="mt-1 h-8 w-full rounded border border-[#98a2b3] px-2 text-xs text-black"><option>California (CA)</option></select></label><label className="block">Country<select className="mt-1 h-8 w-full rounded border border-[#98a2b3] px-2 text-xs text-black"><option>Orange County</option></select></label><label className="block">City<select className="mt-1 h-8 w-full rounded border border-[#98a2b3] px-2 text-xs text-black"><option>Any City</option></select></label><label className="block">ZIP<select className="mt-1 h-8 w-full rounded border border-[#98a2b3] px-2 text-xs text-[#98a2b3]"><option>e.g. 928XXX</option></select></label><button type="button" className="h-8 w-full rounded bg-[#e7f2ff] text-xs text-[#0073df]">Add More Geography</button></div></FilterAccordion>
      <FilterAccordion id="availability" title="Availability" open={openFilters.availability} onToggle={() => toggleFilter("availability")}><div className="mt-2 space-y-1.5 text-xs text-[#667085]">{["Shared", "Exclusive", "Both"].map((item, index) => <label key={item} className="flex items-center gap-1.5"><input defaultChecked={index === 0} type="checkbox" className="accent-[#0073df]" />{item}</label>)}</div></FilterAccordion>
      <FilterAccordion id="freshness" title="Freshness" open={openFilters.freshness} onToggle={() => toggleFilter("freshness")}><div className="mt-2 space-y-1.5 text-xs text-[#667085]">{["Today", "Last 7 Days", "Last 30 Days", "Custom"].map((item, index) => <label key={item} className="flex items-center gap-1.5"><input defaultChecked={index === 0} type="checkbox" className="accent-[#0073df]" />{item}</label>)}</div></FilterAccordion>
      <FilterAccordion id="propertyFilters" title="Property Filters" open={openFilters.propertyFilters} onToggle={() => toggleFilter("propertyFilters")}><div className="mt-3 space-y-2 text-[11px] text-[#667085]"><label className="block">Property type<select className="mt-1 h-8 w-full rounded border border-[#98a2b3] px-2 text-xs text-black"><option>California (CA)</option></select></label>{["Estimated value", "Estimated equity", "Mortgage balance"].map((label) => <label key={label} className="block">{label}<span className="mt-1 grid grid-cols-2 gap-2"><input className="h-8 min-w-0 rounded border border-[#98a2b3] px-2 text-xs" placeholder="Min" /><input className="h-8 min-w-0 rounded border border-[#98a2b3] px-2 text-xs" placeholder="Max" /></span></label>)}</div></FilterAccordion>
      <FilterAccordion id="contactData" title="Contact Data" open={openFilters.contactData} onToggle={() => toggleFilter("contactData")}><div className="mt-2 space-y-1.5 text-xs text-[#667085]">{["Has phone", "Has email", "Has both"].map((item, index) => <label key={item} className="flex items-center gap-1.5"><input defaultChecked={index === 0} type="checkbox" className="accent-[#0073df]" />{item}</label>)}</div></FilterAccordion>
      <FilterAccordion id="price" title="Price" open={openFilters.price} onToggle={() => toggleFilter("price")}><div className="mt-2 grid grid-cols-2 gap-2"><input className="h-8 min-w-0 rounded border border-[#98a2b3] px-2 text-xs" placeholder="Min" /><input className="h-8 min-w-0 rounded border border-[#98a2b3] px-2 text-xs" placeholder="Max" /></div></FilterAccordion><button className="mt-4 h-9 w-full rounded-[4px] bg-[#087ce7] text-sm text-white">Apply</button></aside>
      <div className="min-w-0 p-4"><div className="flex flex-wrap items-center gap-3"><div className="relative w-full lg:w-[306px]"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]" /><input value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 w-full rounded-[5px] border border-[#d0d5dd] pl-9 pr-2 text-xs outline-none focus:border-[#0073df]" placeholder="Search city, county or zip..." /></div><div ref={sortRef} className="relative"><button type="button" onClick={() => setSortOpen((open) => !open)} aria-haspopup="listbox" aria-expanded={sortOpen} className="flex h-9 items-center gap-2 rounded-[5px] border border-[#d0d5dd] px-3 text-xs outline-none transition hover:border-[#0073df] focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2"><SlidersHorizontal size={14} />{sortOption}<ChevronDown size={14} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} /></button>{sortOpen && <div role="listbox" aria-label="Sort leads" className="absolute left-0 z-30 mt-2 w-[137px] rounded-[10px] bg-white py-2 shadow-[0_12px_30px_rgba(16,24,40,0.2)] ring-1 ring-black/5">{sortOptions.slice(1).map((option) => <button key={option} type="button" role="option" aria-selected={sortOption === option} onClick={() => { setSortOption(option); setSortOpen(false); }} className={`flex w-full px-[18px] py-2 text-left text-sm transition hover:bg-[#f4f8fc] focus-visible:bg-[#e7f2ff] focus-visible:outline-none ${sortOption === option ? "bg-[#e7f2ff] text-[#0073df]" : "text-[#545454]"}`}>{option}</button>)}</div>}</div><div className="ml-auto flex items-center gap-4"><div className="flex h-8 overflow-hidden rounded border border-[#edf1f5] text-[11px]"><button className="w-9 border-r border-[#8dc7ff] bg-[#e7f2ff] text-[#0073df]">25</button><button className="w-9 border-r border-[#edf1f5]">50</button><button className="w-10">100</button></div><span className="hidden text-[10px] text-[#333] xl:block">Showing 1-25 of 4,827 Matching Leads</span></div><button className="lg:hidden grid size-9 place-items-center rounded border border-[#d0d5dd]"><Filter size={16} /></button></div>
        <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[850px] text-left text-xs"><thead className="bg-[#fafcff] text-[#667085]"><tr>{["", "Lead Type", "Location", "Property Type", "Est. Value", "Est. Equity", "Added", "Availability", "Price", "Action"].map((head) => <th key={head} className="px-3 py-3 font-medium">{head}</th>)}</tr></thead><tbody>{displayedLeads.map((lead, index) => <tr key={`${lead[0]}-${index}`} className="border-b border-[#f0f2f5] text-[#141936]"><td className="px-3 py-2"><input type="checkbox" /></td><td className="px-3 py-2"><span className={`rounded px-2 py-1 ${tags[lead[0]]}`}>{lead[0]}</span></td>{lead.slice(1, 7).map((value, cell) => <td key={cell} className="max-w-[110px] px-3 py-2">{value}</td>)}<td className="px-3 py-2"><span className={`rounded px-2 py-1 ${lead[7] === "Exclusive" ? "bg-[#ddf9e8] text-[#10a44c]" : "bg-[#e4f4ff] text-[#087ce7]"}`}>{lead[7]}</span></td><td className="px-3 py-2">{lead[8]}</td><td className="px-3 py-2"><button className="rounded border border-[#8dc7ff] px-2 py-1 text-[#087ce7]">View Lead</button></td></tr>)}</tbody></table></div></div></div>
  </section>;
};

export default DashboardMarketplace;
