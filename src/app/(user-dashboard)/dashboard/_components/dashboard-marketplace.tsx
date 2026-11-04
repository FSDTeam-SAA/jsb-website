"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Goal,
  Save,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { apiRequest } from "@/lib/api";
import {
  getMarketplaceLeads,
  type MarketplaceFilters,
  type MarketplaceLead,
} from "@/lib/marketplace-api";
import { createSavedSearch } from "@/lib/saved-search-api";

import LeadPreviewController from "./lead-preview-controller";

type Category = { id: string; name: string };
type FilterSection =
  | "leadType"
  | "geography"
  | "availability"
  | "freshness"
  | "propertyFilters"
  | "contactData"
  | "price";

const initialFilters: MarketplaceFilters = {
  page: 1,
  limit: 25,
  sortBy: "createdAt",
  sortOrder: "desc",
};

const leadTags: Record<string, string> = {
  "Foreclosure Auction": "bg-[#ffe9ed] text-[#fb5570]",
  Foreclosure: "bg-[#ffe9ed] text-[#fb5570]",
  "Pre-Foreclosure": "bg-[#fff2dd] text-[#ca8a04]",
  "Tax Deed Auction": "bg-[#f4e9ff] text-[#a855f7]",
  "Tax Lien": "bg-[#f4e9ff] text-[#a855f7]",
  Bankruptcy: "bg-[#dff8f7] text-[#09a6a0]",
  "Bank Owned / REO": "bg-[#eee8ff] text-[#6d42d8]",
  "REO/Bank-Owned": "bg-[#eee8ff] text-[#6d42d8]",
};

const sortOptions = [
  { label: "Newest Leads", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Highest Value", sortBy: "estValue", sortOrder: "desc" },
  { label: "Lowest Value", sortBy: "estValue", sortOrder: "asc" },
  { label: "Highest Equity", sortBy: "estEquity", sortOrder: "desc" },
] as const;

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

const getCategories = () => apiRequest<Category[]>("/categories");

const currency = (value: number | null, code = "USD", fractionDigits = 0) =>
  value === null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(value);

const relativeAge = (createdAt: string) => {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000),
  );

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)} weeks ago`;
};

const leadLocation = (lead: MarketplaceLead) =>
  [lead.city ?? lead.county, lead.state, lead.zipcode]
    .filter(Boolean)
    .join(", ") || "Location unavailable";

const leadPrice = (lead: MarketplaceLead) =>
  lead.availability === "EXCLUSIVE"
    ? lead.exclusivePrice
    : lead.sharedPrice ?? lead.exclusivePrice;

const availabilityLabel = (availability: MarketplaceLead["availability"]) =>
  availability.charAt(0) + availability.slice(1).toLowerCase();

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
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters);
  const [draftFilters, setDraftFilters] = useState<MarketplaceFilters>({});
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [previewLead, setPreviewLead] = useState<MarketplaceLead | null>(null);
  const [openFilters, setOpenFilters] = useState<Record<FilterSection, boolean>>({
    leadType: true,
    geography: true,
    availability: true,
    freshness: true,
    propertyFilters: true,
    contactData: true,
    price: true,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60_000,
  });
  const marketplaceQuery = useQuery({
    queryKey: ["marketplace", "dashboard", accessToken, filters],
    queryFn: () => getMarketplaceLeads(accessToken!, filters),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 60_000,
  });
  const saveSearchMutation = useMutation({
    mutationFn: (input: { title: string; filters: MarketplaceFilters }) => {
      if (!accessToken) throw new Error("Please sign in to save a search.");
      return createSavedSearch(accessToken, input);
    },
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
      toast.success(response.message || "Search saved successfully.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to save this search.",
      );
    },
  });

  const leads = marketplaceQuery.data?.data ?? [];
  const meta = marketplaceQuery.data?.meta;
  const total = typeof meta?.total === "number" ? meta.total : leads.length;
  const page = typeof meta?.page === "number" ? meta.page : filters.page ?? 1;
  const limit = typeof meta?.limit === "number" ? meta.limit : filters.limit ?? 25;
  const totalPage = typeof meta?.totalPage === "number" ? meta.totalPage : 1;
  const activeSort =
    sortOptions.find(
      (option) =>
        option.sortBy === filters.sortBy && option.sortOrder === filters.sortOrder,
    ) ?? sortOptions[0];

  const updateDraftFilter = <K extends keyof MarketplaceFilters>(
    key: K,
    value: MarketplaceFilters[K],
  ) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const toggleDraftMulti = <T extends string>(
    key: "categoryId" | "availability",
    value: T,
  ) => {
    setDraftFilters((current) => {
      const selected = (current[key] ?? []) as T[];
      return {
        ...current,
        [key]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  };

  const applyFilters = () => {
    setFilters({
      ...draftFilters,
      searchTerm: search.trim() || undefined,
      page: 1,
      limit: filters.limit ?? 25,
      sortBy: filters.sortBy ?? "createdAt",
      sortOrder: filters.sortOrder ?? "desc",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setDraftFilters({});
    setFilters(initialFilters);
  };

  const selectSort = (option: (typeof sortOptions)[number]) => {
    setFilters((current) => ({
      ...current,
      page: 1,
      sortBy: option.sortBy,
      sortOrder: option.sortOrder,
    }));
    setSortOpen(false);
  };

  const selectLimit = (nextLimit: number) => {
    setFilters((current) => ({ ...current, page: 1, limit: nextLimit }));
  };

  const changePage = (nextPage: number) => {
    setFilters((current) => ({ ...current, page: nextPage }));
  };

  const saveSearch = () => {
    if (status !== "authenticated" || !accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }

    const savedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([key]) =>
          !["searchTerm", "page", "limit", "sortBy", "sortOrder"].includes(key),
      ),
    ) as MarketplaceFilters;
    saveSearchMutation.mutate({
      title: search.trim() || filters.searchTerm?.trim() || "Saved Search",
      filters: savedFilters,
    });
  };

  const toggleLead = (leadId: string) => {
    setSelectedLeadIds((current) =>
      current.includes(leadId)
        ? current.filter((id) => id !== leadId)
        : [...current, leadId],
    );
  };

  const toggleAllLeads = () => {
    setSelectedLeadIds((current) =>
      current.length === leads.length ? [] : leads.map((lead) => lead.id),
    );
  };

  const toggleFilter = (filter: FilterSection) => {
    setOpenFilters((current) => ({ ...current, [filter]: !current[filter] }));
  };

  useEffect(() => {
    setSelectedLeadIds([]);
  }, [filters]);

  useEffect(() => {
    const searchTerm = search.trim();
    if (searchTerm === (filters.searchTerm ?? "")) return;

    const timer = window.setTimeout(() => {
      setFilters((current) => ({
        ...current,
        page: 1,
        searchTerm: searchTerm || undefined,
      }));
    }, 400);

    return () => window.clearTimeout(timer);
  }, [filters.searchTerm, search]);

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

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-[#ebf4ff] bg-white shadow-[0_2px_10px_rgba(31,61,96,0.04)]">
      <div className="flex flex-col justify-between gap-3 border-b border-[#edf1f5] px-4 py-3 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <Goal
              size={28}
              className="shrink-0 text-[#087ce7]"
              strokeWidth={2.25}
            />
            <h2 className="text-xl font-bold text-[#17212e]">
              Find Leads Marketplace
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#333]">
            Search and filter thousands of foreclosure, pre foreclosure and
            distressed property leads nationwide.
          </p>
        </div>
        <button
          type="button"
          onClick={saveSearch}
          disabled={saveSearchMutation.isPending}
          className="flex h-8 items-center justify-center gap-1 rounded-[5px] border border-[#0073df] px-3 text-xs text-[#0073df] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={13} />
          {saveSearchMutation.isPending ? "Saving..." : "Save Search"}
        </button>
      </div>

      <div className="grid lg:grid-cols-[288px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#edf1f5] p-4 lg:block">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-bold">Filter</h3>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-[#0073df]"
            >
              Clear All
            </button>
          </div>

          <FilterAccordion
            id="leadType"
            title="Lead Type"
            open={openFilters.leadType}
            onToggle={() => toggleFilter("leadType")}
          >
            <div className="mt-2 space-y-1.5 text-xs text-[#667085]">
              {categoriesQuery.isLoading ? (
                <p>Loading lead types...</p>
              ) : categoriesQuery.isError ? (
                <p className="text-[#b42318]">Lead types could not be loaded.</p>
              ) : (
                (categoriesQuery.data?.data ?? []).map((category) => (
                  <label key={category.id} className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={(draftFilters.categoryId ?? []).includes(category.id)}
                      onChange={() => toggleDraftMulti("categoryId", category.id)}
                      className="accent-[#0073df]"
                    />
                    {category.name}
                  </label>
                ))
              )}
            </div>
          </FilterAccordion>

          <FilterAccordion
            id="geography"
            title="Geography"
            open={openFilters.geography}
            onToggle={() => toggleFilter("geography")}
          >
            <div className="mt-3 space-y-2 text-[11px] text-[#667085]">
              {[
                ["State", "state", "Any state"],
                ["County", "county", "Any county"],
                ["City", "city", "Any city"],
                ["ZIP", "zipcode", "e.g. 92801"],
              ].map(([label, key, placeholder]) => (
                <label key={key} className="block">
                  {label}
                  <input
                    value={(draftFilters[key as keyof MarketplaceFilters] as string) ?? ""}
                    onChange={(event) =>
                      updateDraftFilter(
                        key as keyof MarketplaceFilters,
                        event.target.value,
                      )
                    }
                    placeholder={placeholder}
                    className="mt-1 h-8 w-full rounded border border-[#98a2b3] px-2 text-xs text-black placeholder:text-[#98a2b3]"
                  />
                </label>
              ))}
            </div>
          </FilterAccordion>

          <FilterAccordion
            id="availability"
            title="Availability"
            open={openFilters.availability}
            onToggle={() => toggleFilter("availability")}
          >
            <div className="mt-2 space-y-1.5 text-xs text-[#667085]">
              {availabilityOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={(draftFilters.availability ?? []).includes(option.value)}
                    onChange={() => toggleDraftMulti("availability", option.value)}
                    className="accent-[#0073df]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </FilterAccordion>

          <FilterAccordion
            id="freshness"
            title="Freshness"
            open={openFilters.freshness}
            onToggle={() => toggleFilter("freshness")}
          >
            <div className="mt-2 space-y-1.5 text-xs text-[#667085]">
              {freshnessOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={draftFilters.freshness === option.value}
                    onChange={() =>
                      updateDraftFilter(
                        "freshness",
                        draftFilters.freshness === option.value
                          ? undefined
                          : option.value,
                      )
                    }
                    className="accent-[#0073df]"
                  />
                  {option.label}
                </label>
              ))}
              {draftFilters.freshness === "custom" ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input
                    type="date"
                    value={draftFilters.createdFrom ?? ""}
                    onChange={(event) => updateDraftFilter("createdFrom", event.target.value)}
                    className="h-8 min-w-0 rounded border border-[#98a2b3] px-1 text-[10px]"
                    aria-label="Created from"
                  />
                  <input
                    type="date"
                    value={draftFilters.createdTo ?? ""}
                    onChange={(event) => updateDraftFilter("createdTo", event.target.value)}
                    className="h-8 min-w-0 rounded border border-[#98a2b3] px-1 text-[10px]"
                    aria-label="Created to"
                  />
                </div>
              ) : null}
            </div>
          </FilterAccordion>

          <FilterAccordion
            id="propertyFilters"
            title="Property Filters"
            open={openFilters.propertyFilters}
            onToggle={() => toggleFilter("propertyFilters")}
          >
            <div className="mt-3 space-y-2 text-[11px] text-[#667085]">
              <label className="block">
                Property type
                <select
                  value={draftFilters.propertyType ?? ""}
                  onChange={(event) => updateDraftFilter("propertyType", event.target.value)}
                  className="mt-1 h-8 w-full rounded border border-[#98a2b3] bg-white px-2 text-xs text-black"
                >
                  <option value="">Any property type</option>
                  <option value="Single Family">Single Family</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Condo">Condo</option>
                  <option value="Multi-Family">Multi-Family</option>
                </select>
              </label>
              {[
                ["Estimated value", "minEstValue", "maxEstValue"],
                ["Estimated equity", "minEstEquity", "maxEstEquity"],
                ["Mortgage balance", "minMortgageBalance", "maxMortgageBalance"],
              ].map(([label, minKey, maxKey]) => (
                <label key={label} className="block">
                  {label}
                  <span className="mt-1 grid grid-cols-2 gap-2">
                    <input
                      inputMode="decimal"
                      value={(draftFilters[minKey as keyof MarketplaceFilters] as string) ?? ""}
                      onChange={(event) =>
                        updateDraftFilter(
                          minKey as keyof MarketplaceFilters,
                          event.target.value,
                        )
                      }
                      className="h-8 min-w-0 rounded border border-[#98a2b3] px-2 text-xs"
                      placeholder="Min"
                    />
                    <input
                      inputMode="decimal"
                      value={(draftFilters[maxKey as keyof MarketplaceFilters] as string) ?? ""}
                      onChange={(event) =>
                        updateDraftFilter(
                          maxKey as keyof MarketplaceFilters,
                          event.target.value,
                        )
                      }
                      className="h-8 min-w-0 rounded border border-[#98a2b3] px-2 text-xs"
                      placeholder="Max"
                    />
                  </span>
                </label>
              ))}
            </div>
          </FilterAccordion>

          <FilterAccordion
            id="contactData"
            title="Contact Data"
            open={openFilters.contactData}
            onToggle={() => toggleFilter("contactData")}
          >
            <div className="mt-2 space-y-1.5 text-xs text-[#667085]">
              {[
                ["Has phone", "phone"],
                ["Has email", "email"],
                ["Has both", "both"],
              ].map(([label, value]) => (
                <label key={value} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={draftFilters.contactData === value}
                    onChange={() =>
                      updateDraftFilter(
                        "contactData",
                        draftFilters.contactData === value
                          ? undefined
                          : (value as MarketplaceFilters["contactData"]),
                      )
                    }
                    className="accent-[#0073df]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </FilterAccordion>

          <FilterAccordion
            id="price"
            title="Price"
            open={openFilters.price}
            onToggle={() => toggleFilter("price")}
          >
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                inputMode="decimal"
                value={draftFilters.minPrice ?? ""}
                onChange={(event) => updateDraftFilter("minPrice", event.target.value)}
                className="h-8 min-w-0 rounded border border-[#98a2b3] px-2 text-xs"
                placeholder="Min"
              />
              <input
                inputMode="decimal"
                value={draftFilters.maxPrice ?? ""}
                onChange={(event) => updateDraftFilter("maxPrice", event.target.value)}
                className="h-8 min-w-0 rounded border border-[#98a2b3] px-2 text-xs"
                placeholder="Max"
              />
            </div>
          </FilterAccordion>

          <button
            type="button"
            onClick={applyFilters}
            className="mt-4 h-9 w-full rounded-[4px] bg-[#087ce7] text-sm text-white"
          >
            Apply
          </button>
        </aside>

        <div className="min-w-0 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <form
              className="relative w-full lg:w-[306px]"
              onSubmit={(event) => {
                event.preventDefault();
                applyFilters();
              }}
            >
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-9 w-full rounded-[5px] border border-[#d0d5dd] pl-9 pr-2 text-xs outline-none focus:border-[#0073df]"
                placeholder="Search city, county or zip..."
                aria-label="Search marketplace leads"
              />
            </form>

            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                className="flex h-9 items-center gap-2 rounded-[5px] border border-[#d0d5dd] px-3 text-xs outline-none transition hover:border-[#0073df] focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2"
              >
                <SlidersHorizontal size={14} />
                {activeSort.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>
              {sortOpen ? (
                <div
                  role="listbox"
                  aria-label="Sort leads"
                  className="absolute left-0 z-30 mt-2 w-[160px] rounded-[10px] bg-white py-2 shadow-[0_12px_30px_rgba(16,24,40,0.2)] ring-1 ring-black/5"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={`${option.sortBy}-${option.sortOrder}`}
                      type="button"
                      role="option"
                      aria-selected={activeSort.label === option.label}
                      onClick={() => selectSort(option)}
                      className={`flex w-full px-[18px] py-2 text-left text-sm transition hover:bg-[#f4f8fc] focus-visible:bg-[#e7f2ff] focus-visible:outline-none ${activeSort.label === option.label ? "bg-[#e7f2ff] text-[#0073df]" : "text-[#545454]"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="flex h-8 overflow-hidden rounded border border-[#edf1f5] text-[11px]">
                {[25, 50, 100].map((pageSize, index) => (
                  <button
                    key={pageSize}
                    type="button"
                    onClick={() => selectLimit(pageSize)}
                    className={`w-9 ${index < 2 ? "border-r border-[#edf1f5]" : ""} ${limit === pageSize ? "bg-[#e7f2ff] text-[#0073df]" : ""}`}
                  >
                    {pageSize}
                  </button>
                ))}
              </div>
              <span className="hidden text-[10px] text-[#333] xl:block">
                Showing {leads.length ? (page - 1) * limit + 1 : 0}-
                {Math.min(page * limit, total)} of {total.toLocaleString()} Matching Leads
              </span>
            </div>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="bg-[#fafcff] text-[#667085]">
                <tr>
                  <th className="px-3 py-3 font-medium">
                    <input
                      type="checkbox"
                      checked={leads.length > 0 && selectedLeadIds.length === leads.length}
                      onChange={toggleAllLeads}
                      className="accent-[#0073df]"
                      aria-label="Select all visible leads"
                    />
                  </th>
                  {[
                    "Lead Type",
                    "Location",
                    "Property Type",
                    "Est. Value",
                    "Est. Equity",
                    "Added",
                    "Availability",
                    "Price",
                    "Action",
                  ].map((head) => (
                    <th key={head} className="px-3 py-3 font-medium">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {status === "loading" || marketplaceQuery.isLoading ? (
                  Array.from({ length: 6 }, (_, row) => (
                    <tr key={row} className="border-b border-[#f0f2f5]">
                      {Array.from({ length: 10 }, (_, cell) => (
                        <td key={cell} className="px-3 py-3">
                          <span className="block h-3 animate-pulse rounded bg-[#edf1f6]" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : status !== "authenticated" || !accessToken ? (
                  <tr>
                    <td colSpan={10} className="px-3 py-10 text-center text-[#667085]">
                      Sign in to browse marketplace leads.
                    </td>
                  </tr>
                ) : marketplaceQuery.isError ? (
                  <tr>
                    <td colSpan={10} className="px-3 py-8 text-center">
                      <p className="text-[#b42318]">Marketplace leads could not be loaded.</p>
                      <button
                        type="button"
                        onClick={() => marketplaceQuery.refetch()}
                        className="mt-2 rounded border border-[#8dc7ff] px-2 py-1 text-[#087ce7]"
                      >
                        Try again
                      </button>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-3 py-10 text-center text-[#667085]">
                      No marketplace leads found. Try updating your filters.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-[#f0f2f5] text-[#141936]">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedLeadIds.includes(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                          className="accent-[#0073df]"
                          aria-label={`Select lead ${lead.leadNumber}`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded px-2 py-1 ${leadTags[lead.category.name] ?? "bg-[#edf2f7] text-[#475467]"}`}
                        >
                          {lead.category.name}
                        </span>
                      </td>
                      <td className="max-w-[140px] px-3 py-2">{leadLocation(lead)}</td>
                      <td className="px-3 py-2">{lead.propertyType ?? "—"}</td>
                      <td className="px-3 py-2">{currency(lead.estValue, lead.currency)}</td>
                      <td className="px-3 py-2">{currency(lead.estEquity, lead.currency)}</td>
                      <td className="px-3 py-2">{relativeAge(lead.createdAt)}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded px-2 py-1 ${lead.availability === "EXCLUSIVE" ? "bg-[#ddf9e8] text-[#10a44c]" : lead.availability === "BOTH" ? "bg-[#f3eaff] text-[#6d42d8]" : "bg-[#e4f4ff] text-[#087ce7]"}`}
                        >
                          {availabilityLabel(lead.availability)}
                        </span>
                      </td>
                      <td className="px-3 py-2">{currency(leadPrice(lead), lead.currency, 2)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => setPreviewLead(lead)}
                          className="rounded border border-[#8dc7ff] px-2 py-1 text-[#087ce7]"
                        >
                          View Lead
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!marketplaceQuery.isLoading && !marketplaceQuery.isError && leads.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center justify-end gap-2 text-[10px] text-[#667085]">
              <button
                type="button"
                onClick={() => changePage(Math.max(1, page - 1))}
                disabled={page === 1 || marketplaceQuery.isFetching}
                className="rounded px-2 py-1 transition hover:bg-[#f2f7fc] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page} of {totalPage}</span>
              <button
                type="button"
                onClick={() => changePage(page + 1)}
                disabled={page >= totalPage || marketplaceQuery.isFetching}
                className="rounded px-2 py-1 transition hover:bg-[#f2f7fc] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <LeadPreviewController
        lead={previewLead}
        onClose={() => setPreviewLead(null)}
      />
    </section>
  );
};

export default DashboardMarketplace;
