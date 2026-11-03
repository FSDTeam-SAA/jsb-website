"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import type { MarketplaceFilters } from "@/lib/marketplace-api";

type Category = { id: string; name: string };
type FilterSectionProps = { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode };

const availabilityOptions = [
  { label: "Shared", value: "SHARED" },
  { label: "Exclusive", value: "EXCLUSIVE" },
  { label: "Both", value: "BOTH" },
] as const;
const freshnessOptions = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7Days" },
  { label: "Last 30 Days", value: "last30Days" },
  { label: "Custom", value: "custom" },
] as const;
const contactDataOptions = [
  { label: "Has phone", value: "phone" },
  { label: "Has email", value: "email" },
  { label: "Has both", value: "both" },
] as const;

const emptyFilters: MarketplaceFilters = {};
const getCategories = () => apiRequest<Category[]>("/categories");

const FilterSection = ({ title, isOpen, onToggle, children }: FilterSectionProps) => (
  <section className="border-b border-[#f1f4f9] py-2 last:border-b-0">
    <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-center justify-between py-1 text-left text-sm font-bold text-[#1e1e1e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce1] focus-visible:ring-offset-2">
      {title}<ChevronDown size={16} strokeWidth={1.8} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen && <div className="pt-3">{children}</div>}
  </section>
);

const CheckboxList = <T extends string>({ options, selected, onChange }: { options: readonly { label: string; value: T }[]; selected: readonly T[]; onChange: (value: T) => void }) => (
  <div className="space-y-2">
    {options.map((option) => {
      const id = `filter-${option.value}`;
      return <label key={option.value} htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#585858]">
        <Checkbox id={id} checked={selected.includes(option.value)} onCheckedChange={() => onChange(option.value)} className="size-[14px] rounded-[2px] border-[#949494] data-checked:border-[#087ce1] data-checked:bg-[#087ce1] [&_svg]:size-[11px]" />
        {option.label}
      </label>;
    })}
  </div>
);

const TextField = ({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (value: string) => void; placeholder: string }) => (
  <label className="grid grid-cols-[102px_minmax(0,1fr)] items-center gap-2 text-xs font-medium text-[#585858]">
    <span>{label}</span>
    <Input value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-[34px] rounded-[8px] border-[#949494] px-2 text-xs placeholder:text-[#949494] focus-visible:border-[#087ce1] focus-visible:ring-[#087ce1]/20" />
  </label>
);

const FindLeadsFilter = ({ onApply }: { onApply: (filters: MarketplaceFilters) => void }) => {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [filters, setFilters] = useState<MarketplaceFilters>(emptyFilters);
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories, staleTime: 5 * 60 * 1000 });
  const categories = categoriesQuery.data?.data ?? [];

  const update = <K extends keyof MarketplaceFilters>(key: K, value: MarketplaceFilters[K]) => setFilters((current) => ({ ...current, [key]: value }));
  const toggleSection = (title: string) => setOpenSections((current) => current.includes(title) ? current.filter((section) => section !== title) : [...current, title]);
  const toggleMulti = <T extends string>(key: "categoryId" | "availability", value: T) => {
    setFilters((current) => {
      const selected = (current[key] ?? []) as T[];
      return { ...current, [key]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] };
    });
  };
  const clearAll = () => { setFilters(emptyFilters); onApply(emptyFilters); };
  const rangeInput = (key: keyof MarketplaceFilters, placeholder: string) => <Input inputMode="decimal" value={(filters[key] as string | undefined) ?? ""} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} className="h-[34px] rounded-[8px] border-[#949494] px-2 text-xs placeholder:text-[#949494] focus-visible:border-[#087ce1] focus-visible:ring-[#087ce1]/20" />;

  return (
    <aside className="hidden w-[300px] shrink-0 self-stretch border-r border-[#ebf4ff] bg-white p-3 lg:block">
      <div className="flex items-center justify-between border-b-2 border-[#f1f4f9] py-2"><h2 className="text-base font-bold text-black">Filter</h2><button type="button" onClick={clearAll} className="text-xs font-medium text-[#1779fe]">Clear All</button></div>
      <FilterSection title="Lead Type" isOpen={openSections.includes("Lead Type")} onToggle={() => toggleSection("Lead Type")}>
        {categoriesQuery.isLoading && <p className="text-xs text-[#667085]">Loading lead types…</p>}
        {categoriesQuery.isError && <p className="text-xs text-[#b42318]">Lead types could not be loaded.</p>}
        {!categoriesQuery.isLoading && !categoriesQuery.isError && <CheckboxList options={categories.map((category) => ({ label: category.name, value: category.id }))} selected={filters.categoryId ?? []} onChange={(value) => toggleMulti("categoryId", value)} />}
      </FilterSection>
      <FilterSection title="Geography" isOpen={openSections.includes("Geography")} onToggle={() => toggleSection("Geography")}><div className="space-y-2"><TextField label="State" value={filters.state} onChange={(value) => update("state", value)} placeholder="Any state" /><TextField label="County" value={filters.county} onChange={(value) => update("county", value)} placeholder="Any county" /><TextField label="City" value={filters.city} onChange={(value) => update("city", value)} placeholder="Any city" /><TextField label="ZIP" value={filters.zipcode} onChange={(value) => update("zipcode", value)} placeholder="e.g. 92801" /></div></FilterSection>
      <FilterSection title="Availability" isOpen={openSections.includes("Availability")} onToggle={() => toggleSection("Availability")}><CheckboxList options={availabilityOptions} selected={filters.availability ?? []} onChange={(value) => toggleMulti("availability", value)} /></FilterSection>
      <FilterSection title="Freshness" isOpen={openSections.includes("Freshness")} onToggle={() => toggleSection("Freshness")}><CheckboxList options={freshnessOptions} selected={filters.freshness ? [filters.freshness] : []} onChange={(value) => update("freshness", filters.freshness === value ? undefined : value)} />{filters.freshness === "custom" && <div className="mt-3 space-y-2"><TextField label="From" value={filters.createdFrom} onChange={(value) => update("createdFrom", value)} placeholder="YYYY-MM-DD" /><TextField label="To" value={filters.createdTo} onChange={(value) => update("createdTo", value)} placeholder="YYYY-MM-DD" /></div>}</FilterSection>
      <FilterSection title="Property Filters" isOpen={openSections.includes("Property Filters")} onToggle={() => toggleSection("Property Filters")}><div className="space-y-3"><label className="block text-xs font-medium text-[#585858]"><span className="mb-1 block">Property type</span><select value={filters.propertyType ?? ""} onChange={(event) => update("propertyType", event.target.value)} className="h-[34px] w-full rounded-[8px] border border-[#949494] bg-white px-2 text-xs"><option value="">Any property type</option><option value="Single Family">Single Family</option><option value="Townhouse">Townhouse</option><option value="Condo">Condo</option><option value="Multi-Family">Multi-Family</option></select></label>{[["Estimated value", "minEstValue", "maxEstValue"], ["Estimated equity", "minEstEquity", "maxEstEquity"], ["Mortgage balance", "minMortgageBalance", "maxMortgageBalance"]].map(([label, minKey, maxKey]) => <div key={label}><p className="mb-1 text-xs font-medium text-[#585858]">{label}</p><div className="grid grid-cols-2 gap-2">{rangeInput(minKey as keyof MarketplaceFilters, "Min")}{rangeInput(maxKey as keyof MarketplaceFilters, "Max")}</div></div>)}</div></FilterSection>
      <FilterSection title="Contact Data" isOpen={openSections.includes("Contact Data")} onToggle={() => toggleSection("Contact Data")}><CheckboxList options={contactDataOptions} selected={filters.contactData ? [filters.contactData] : []} onChange={(value) => update("contactData", filters.contactData === value ? undefined : value)} /></FilterSection>
      <FilterSection title="Price" isOpen={openSections.includes("Price")} onToggle={() => toggleSection("Price")}><div className="grid grid-cols-2 gap-2"><label className="text-xs font-medium text-[#585858]">Minimum{rangeInput("minPrice", "$0.00")}</label><label className="text-xs font-medium text-[#585858]">Maximum{rangeInput("maxPrice", "$1000.00")}</label></div></FilterSection>
      <button type="button" onClick={() => onApply(filters)} className="mt-3 h-9 w-full rounded-[6px] bg-[#087ce1] text-sm font-medium text-white transition hover:bg-[#056fc7]">Apply</button>
    </aside>
  );
};

export default FindLeadsFilter;
