"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  ChevronDown,
  Plus,
  Save,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addMultipleToCart } from "@/lib/cart-api";
import { createSavedSearch } from "@/lib/saved-search-api";
import { getSavedSearchResults } from "@/lib/saved-search-api";
import type { SavedSearchResultsResponse } from "@/lib/saved-search-api";
import {
  getMarketplaceLeads,
  type MarketplaceFilters,
  type MarketplaceLead,
} from "@/lib/marketplace-api";

const leadTag: Record<string, string> = {
  "Foreclosure Auction": "bg-[#ffe9ed] text-[#fb5570]",
  "Pre-Foreclosure": "bg-[#fff2dd] text-[#ca8a04]",
  "Tax Deed Auction": "bg-[#f3eaff] text-[#a855f7]",
  "Bank Owned / REO": "bg-[#eee8ff] text-[#6d42d8]",
  "Short Sale": "bg-[#dff8f7] text-[#0ca59f]",
};
const emptyLeads: MarketplaceLead[] = [];
const pageSizes = [10, 25, 50] as const;

const currency = (value: number | null, code = "USD") =>
  value === null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
        maximumFractionDigits: 0,
      }).format(value);

const age = (createdAt: string) => {
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

const location = (lead: MarketplaceLead) =>
  [lead.city ?? lead.county, lead.state, lead.zipcode].filter(Boolean).join(", ") ||
  "Location unavailable";

const priceFor = (lead: MarketplaceLead) =>
  lead.availability === "EXCLUSIVE"
    ? lead.exclusivePrice
    : lead.sharedPrice ?? lead.exclusivePrice;

const availabilityLabel = (availability: MarketplaceLead["availability"]) =>
  availability.charAt(0) + availability.slice(1).toLowerCase();

const MarketplaceTableSkeleton = () => (
  <div className="mt-3 hidden overflow-x-auto sm:block">
    <table className="w-full min-w-[820px] text-left text-[9px]">
      <thead className="bg-[#fafcff] text-[#98a2b3]">
        <tr>
          {Array.from({ length: 10 }, (_, index) => (
            <th key={index} className="px-2 py-3 font-medium">
              <span className="block h-2 w-12 animate-pulse rounded bg-[#e7edf4]" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }, (_, row) => (
          <tr key={row} className="border-b border-[#eff2f5]">
            {Array.from({ length: 10 }, (_, cell) => (
              <td key={cell} className="px-2 py-3">
                <span className="block h-3 animate-pulse rounded bg-[#edf1f6]" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MarketplaceCardsSkeleton = () => (
  <div className="mt-3 space-y-3 sm:hidden">
    {Array.from({ length: 5 }, (_, index) => (
      <div key={index} className="rounded-xl border border-[#edf1f5] bg-white p-4">
        <div className="h-4 w-28 animate-pulse rounded bg-[#e7edf4]" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="h-8 animate-pulse rounded bg-[#edf1f6]" />
          <div className="h-8 animate-pulse rounded bg-[#edf1f6]" />
        </div>
      </div>
    ))}
  </div>
);

const MarketplaceError = ({ onRetry }: { onRetry: () => void }) => (
  <div role="alert" className="mt-3 rounded-lg border border-[#f1c5c5] bg-[#fff7f7] px-5 py-8 text-center">
    <h2 className="text-sm font-bold text-[#8c311e]">Marketplace leads could not be loaded</h2>
    <p className="mt-1 text-xs text-[#5d3830]">Please check your connection and try again.</p>
    <button type="button" onClick={onRetry} className="mt-4 rounded-[4px] bg-[#087ce7] px-3 py-2 text-xs font-medium text-white">
      Try again
    </button>
  </div>
);

const MarketplaceEmpty = () => (
  <div className="mt-3 rounded-lg border border-dashed border-[#b7c9dc] bg-[#f7fbff] px-5 py-8 text-center">
    <h2 className="text-sm font-bold text-[#104170]">No marketplace leads found</h2>
    <p className="mt-1 text-xs text-[#38526e]">Try updating your search or filters.</p>
  </div>
);

const FindLeadsResults = ({
  filters,
  savedSearchId,
  savedSearchRequestKey,
  savedSearchResults,
  onFiltersChange,
  onBulkOrder,
  onViewLead,
}: {
  filters: MarketplaceFilters;
  savedSearchId?: string | null;
  savedSearchRequestKey?: number;
  savedSearchResults?: SavedSearchResultsResponse | null;
  onFiltersChange: (filters: MarketplaceFilters) => void;
  onBulkOrder: () => void;
  onViewLead: (lead: MarketplaceLead) => void;
}) => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const marketplaceQuery = useQuery({
    queryKey: ["marketplace", accessToken, filters, savedSearchId, savedSearchRequestKey],
    queryFn: () => savedSearchId ? getSavedSearchResults(accessToken!, savedSearchId) : getMarketplaceLeads(accessToken!, filters),
    enabled: status === "authenticated" && Boolean(accessToken) && !savedSearchResults,
    staleTime: savedSearchId ? 0 : 60_000,
  });
  const addMultipleToCartMutation = useMutation({
    mutationFn: (leadsToAdd: MarketplaceLead[]) => {
      if (!accessToken) throw new Error("Please sign in to add leads to your cart.");
      return addMultipleToCart(accessToken, {
        cartData: leadsToAdd.map((lead) => ({
          leadId: lead.id,
          priceType: lead.availability === "EXCLUSIVE" ? "EXCLUSIVE" : "SHARED",
        })),
      });
    },
    onSuccess: (response) => {
      setSelected([]);
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(response.message || "Selected leads added to cart successfully.");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add the selected leads to your cart.",
      );
    },
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
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to save this search."),
  });

  const leads = savedSearchResults?.data ?? marketplaceQuery.data?.data ?? emptyLeads;
  const meta = savedSearchResults?.meta ?? marketplaceQuery.data?.meta;
  const total = typeof meta?.total === "number" ? meta.total : leads.length;
  const results = leads;
  const page = typeof meta?.page === "number" ? meta.page : filters.page ?? 1;
  const limit = typeof meta?.limit === "number" ? meta.limit : filters.limit ?? results.length;
  const totalPage = typeof meta?.totalPage === "number" ? meta.totalPage : 1;
  const canPaginate = !savedSearchResults && Boolean(meta);

  useEffect(() => {
    setSelected([]);
  }, [filters]);

  useEffect(() => {
    setSearchTerm(filters.searchTerm ?? "");
  }, [filters.searchTerm]);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim();
    if (normalizedSearchTerm === (filters.searchTerm ?? "")) return;

    const timer = window.setTimeout(() => {
      onFiltersChange({
        ...filters,
        page: 1,
        searchTerm: normalizedSearchTerm || undefined,
      });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [filters, onFiltersChange, searchTerm]);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );

  const toggleAll = () =>
    setSelected((current) =>
      current.length === results.length ? [] : results.map((lead) => lead.id),
    );

  const addSelectedLeads = () => {
    if (status !== "authenticated" || !accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }
    const leadsToAdd = leads.filter((lead) => selected.includes(lead.id));
    if (!leadsToAdd.length) {
      toast.error("Select at least one lead before adding to cart.");
      return;
    }
    addMultipleToCartMutation.mutate(leadsToAdd);
  };

  const isLoading = status === "loading" || (!savedSearchResults && marketplaceQuery.isLoading);
  const needsAuthentication = status === "unauthenticated" || !accessToken;
  const applySearch = () => {
    onFiltersChange({ ...filters, page: 1, searchTerm: searchTerm.trim() || undefined });
  };
  const changeSort = (value: string) => {
    const [sortBy, sortOrder] = value.split(":") as [MarketplaceFilters["sortBy"], MarketplaceFilters["sortOrder"]];
    onFiltersChange({ ...filters, page: 1, sortBy, sortOrder });
  };
  const changePage = (nextPage: number) => {
    onFiltersChange({ ...filters, page: nextPage });
  };
  const changeLimit = (nextLimit: number) => {
    onFiltersChange({ ...filters, page: 1, limit: nextLimit });
  };
  const saveSearch = () => {
    if (status !== "authenticated" || !accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }
    const appliedSearchTerm = searchTerm.trim() || filters.searchTerm?.trim();
    const savedFilters = Object.fromEntries(
      Object.entries({
        ...filters,
        searchTerm: appliedSearchTerm || undefined,
      }).filter(([key]) => !["page", "limit", "sortBy", "sortOrder"].includes(key)),
    ) as MarketplaceFilters;
    const title = appliedSearchTerm || "Saved Search";
    saveSearchMutation.mutate({ title, filters: savedFilters });
  };

  return (
    <div className="min-w-0 flex-1">
      <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
        <form
          className="relative w-full xl:max-w-[400px]"
          onSubmit={(event) => {
            event.preventDefault();
            applySearch();
          }}
        >
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
          />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search city, county or zip..."
            aria-label="Search marketplace leads"
            className="h-11 w-full rounded-xl border border-[#cfd9e5] bg-white pl-10 pr-10 text-sm text-[#344054] outline-none transition placeholder:text-[#98a2b3] hover:border-[#9ab9d9] focus:border-[#087ce7] focus:ring-4 focus:ring-[#087ce7]/10"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-[#667085] transition hover:bg-[#edf4fb] hover:text-[#087ce7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7]"
            >
              <X size={16} />
            </button>
          ) : null}
        </form>
        <label className="relative flex h-11 shrink-0 items-center rounded-xl border border-[#cfd9e5] bg-white pl-3 pr-9 text-sm text-[#344054] transition hover:border-[#9ab9d9] focus-within:border-[#087ce7] focus-within:ring-4 focus-within:ring-[#087ce7]/10">
          <SlidersHorizontal size={16} className="mr-2 shrink-0 text-[#087ce7]" />
          <select
            value={`${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "desc"}`}
            onChange={(event) => changeSort(event.target.value)}
            aria-label="Sort marketplace leads"
            className="h-full min-w-[150px] appearance-none bg-transparent pr-2 outline-none"
          >
            <option value="createdAt:desc">Newest Leads</option>
            <option value="createdAt:asc">Oldest Leads</option>
            <option value="estValue:desc">Highest Value</option>
            <option value="estValue:asc">Lowest Value</option>
            <option value="estEquity:desc">Highest Equity</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 text-[#667085]"
          />
        </label>
        <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-2 xl:ml-auto xl:flex xl:w-auto">
          <button
            type="button"
            onClick={saveSearch}
            disabled={saveSearchMutation.isPending}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#087ce7] bg-white px-3 text-sm font-semibold text-[#087ce7] transition hover:bg-[#eef7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 xl:w-auto"
          >
            <Save size={16} aria-hidden="true" />
            {saveSearchMutation.isPending ? "Saving search..." : "Save Search"}
          </button>
          <button
            type="button"
            onClick={onBulkOrder}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#00a77a] px-3 text-sm font-semibold text-white transition hover:bg-[#008b66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a77a] focus-visible:ring-offset-2 xl:w-auto"
          >
            <Plus size={17} aria-hidden="true" />
            Make Bulk Order
          </button>
        </div>
      </div>

      {isLoading && <><MarketplaceTableSkeleton /><MarketplaceCardsSkeleton /></>}

      {!isLoading && (needsAuthentication || marketplaceQuery.isError) && (
        <MarketplaceError onRetry={() => marketplaceQuery.refetch()} />
      )}

      {!isLoading && !marketplaceQuery.isError && !needsAuthentication && results.length === 0 && <MarketplaceEmpty />}

      {!isLoading && !marketplaceQuery.isError && !needsAuthentication && results.length > 0 && (
        <>
          <div className="mt-3 hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[820px] text-left text-[9px]">
              <thead className="bg-[#fafcff] text-[#98a2b3]">
                <tr>
                  <th className="px-2 py-3 font-medium">
                    <input type="checkbox" checked={selected.length === results.length} onChange={toggleAll} className="accent-[#087ce7]" aria-label="Select all visible leads" />
                  </th>
                  {["Lead Type", "Location", "Property Type", "Est.Value", "Est.Equity", "Added", "Availability", "Price", "Action"].map((title) => (
                    <th key={title} className="px-2 py-3 font-medium">{title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((lead) => (
                  <tr key={lead.id} className="border-b border-[#eff2f5] text-[#475467]">
                    <td className="px-2 py-2">
                      <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggle(lead.id)} className="accent-[#087ce7]" aria-label={`Select lead ${lead.leadNumber}`} />
                    </td>
                    <td className="px-2 py-2">
                      <span className={`rounded px-1.5 py-1 ${leadTag[lead.category.name] ?? "bg-[#edf2f7] text-[#475467]"}`}>{lead.category.name}</span>
                    </td>
                    <td className="max-w-[115px] px-2 py-2">{location(lead)}</td>
                    <td className="px-2 py-2">{lead.propertyType ?? "—"}</td>
                    <td className="px-2 py-2">{currency(lead.estValue, lead.currency)}</td>
                    <td className="px-2 py-2">{currency(lead.estEquity, lead.currency)}</td>
                    <td className="px-2 py-2">{age(lead.createdAt)}</td>
                    <td className="px-2 py-2">
                      <span className={`rounded px-1.5 py-1 ${lead.availability === "EXCLUSIVE" ? "bg-[#ddf9e8] text-[#10a44c]" : lead.availability === "BOTH" ? "bg-[#f3eaff] text-[#6d42d8]" : "bg-[#e4f4ff] text-[#087ce7]"}`}>{availabilityLabel(lead.availability)}</span>
                    </td>
                    <td className="px-2 py-2">{currency(priceFor(lead), lead.currency)}</td>
                    <td className="px-2 py-2">
                      <button type="button" onClick={() => onViewLead(lead)} className="rounded-lg border border-[#8dc7ff] px-1.5 py-1 text-[#087ce7]">View Lead</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 space-y-3 sm:hidden">
            {results.map((lead) => {
              const isSelected = selected.includes(lead.id);

              return (
                <article
                  key={lead.id}
                  className={`rounded-xl border p-4 transition ${isSelected ? "border-[#8dc7ff] bg-[#f4f9ff]" : "border-[#e4edf5] bg-white"}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(lead.id)}
                      className="mt-1 size-4 shrink-0 accent-[#087ce7]"
                      aria-label={`Select lead ${lead.leadNumber}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <span className={`w-fit rounded px-2 py-1 text-xs font-medium ${leadTag[lead.category.name] ?? "bg-[#edf2f7] text-[#475467]"}`}>
                          {lead.category.name}
                        </span>
                        <span className="shrink-0 text-sm font-bold text-[#17212e]">
                          {currency(priceFor(lead), lead.currency)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#344054]">
                        {location(lead)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#667085]">
                        <span>{lead.propertyType ?? "Property type unavailable"}</span>
                        <span aria-hidden="true">•</span>
                        <span>{age(lead.createdAt)}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#edf1f5] pt-3">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${lead.availability === "EXCLUSIVE" ? "bg-[#ddf9e8] text-[#10a44c]" : lead.availability === "BOTH" ? "bg-[#f3eaff] text-[#6d42d8]" : "bg-[#e4f4ff] text-[#087ce7]"}`}>
                          {availabilityLabel(lead.availability)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onViewLead(lead)}
                          className="rounded-lg border border-[#8dc7ff] px-3 py-1.5 text-xs font-semibold text-[#087ce7]"
                        >
                          View Lead
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div className="sticky bottom-3 mt-3 flex flex-col gap-3 rounded-[10px] border border-[#d5dce5] bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[16px] font-medium text-[#344054]">{selected.length} Leads Selected</p>
              <p className="hidden text-[10px] text-[#0073df] sm:block">{selected.filter((id) => leads.find((lead) => lead.id === id)?.availability === "SHARED").length} Shared Lead &nbsp;•&nbsp; {selected.filter((id) => leads.find((lead) => lead.id === id)?.availability === "EXCLUSIVE").length} Exclusive Lead</p>
              <button type="button" onClick={addSelectedLeads} disabled={addMultipleToCartMutation.isPending} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#087ce7] px-5 text-xs text-white disabled:cursor-not-allowed disabled:opacity-60 sm:h-8 sm:w-auto sm:px-8 sm:text-[10px]">{addMultipleToCartMutation.isPending ? "Adding..." : "Add to Cart"} <ShoppingCart size={13} /></button>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] text-[#98a2b3]">
            <span>
              Showing {results.length ? (page - 1) * limit + 1 : 0}-
              {Math.min(page * limit, total)} of {total.toLocaleString()} Matching Leads
            </span>
            {canPaginate ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex overflow-hidden rounded-lg border border-[#d0d5dd]">
                  {pageSizes.map((pageSize) => (
                    <button
                      key={pageSize}
                      type="button"
                      onClick={() => changeLimit(pageSize)}
                      className={`min-w-8 px-2 py-1 ${limit === pageSize ? "bg-[#e7f2ff] font-medium text-[#087ce7]" : "text-[#667085]"}`}
                    >
                      {pageSize}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => changePage(Math.max(1, page - 1))}
                  disabled={page === 1 || marketplaceQuery.isFetching}
                  className="rounded-lg px-2 py-1 text-[#667085] transition hover:bg-[#f2f7fc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="whitespace-nowrap">Page {page} of {totalPage}</span>
                <button
                  type="button"
                  onClick={() => changePage(page + 1)}
                  disabled={page >= totalPage || marketplaceQuery.isFetching}
                  className="rounded-lg px-2 py-1 text-[#667085] transition hover:bg-[#f2f7fc] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default FindLeadsResults;
