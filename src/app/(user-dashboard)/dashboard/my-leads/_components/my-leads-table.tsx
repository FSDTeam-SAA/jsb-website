"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  PurchasedLead,
  PurchasedLeadsMeta,
} from "@/lib/purchased-leads-api";

type MyLeadsTableProps = {
  leads: PurchasedLead[];
  meta?: PurchasedLeadsMeta;
  page: number;
  limit: number;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onViewLead: (lead: PurchasedLead) => void;
};

const pageSizes = [10, 25, 50];

const leadTypeClass: Record<string, string> = {
  Foreclosure: "bg-[#ffe9ed] text-[#fb5570]",
  "Pre-Foreclosure": "bg-[#fff2dd] text-[#ca8a04]",
  "Tax Lien": "bg-[#f3eaff] text-[#a855f7]",
  Bankruptcy: "bg-[#dff8f7] text-[#0ca59f]",
  "REO/Bank-Owned": "bg-[#eee8ff] text-[#6d42d8]",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatPriceType = (priceType: string) =>
  priceType.charAt(0) + priceType.slice(1).toLowerCase();

const getLocation = (lead: PurchasedLead["lead"]) =>
  [lead.city, lead.state, lead.zipcode].filter(Boolean).join(", ");

const MyLeadsTable = ({
  leads,
  meta,
  page,
  limit,
  isLoading,
  isError,
  isAuthenticated,
  onPageChange,
  onLimitChange,
  onViewLead,
}: MyLeadsTableProps) => {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      leads.filter((purchasedLead) =>
        [
          purchasedLead.lead.leadNumber,
          purchasedLead.lead.category.name,
          purchasedLead.lead.propertyType,
          purchasedLead.lead.propertyAddress,
          purchasedLead.lead.city,
          purchasedLead.lead.county,
          purchasedLead.lead.state,
          purchasedLead.lead.zipcode,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [leads, query],
  );
  const firstResult = meta?.total ? (page - 1) * limit + 1 : 0;
  const lastResult = meta?.total ? Math.min(page * limit, meta.total) : 0;

  return (
    <>
      <div className="flex flex-wrap gap-2 border-b border-[#edf1f5] pb-3">
        <div className="relative min-w-[230px] max-w-[335px] flex-1">
          <Search className="absolute left-2 top-2 text-[#98a2b3]" size={13} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city, county or zip..."
            className="h-8 w-full rounded-[4px] border border-[#d0d5dd] pl-7 pr-2 text-[9px]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[9px]">
          <thead className="bg-[#fafcff] text-[#667085]">
            <tr>
              {[
                "Lead ID",
                "Lead Type",
                "Property Type",
                "Location",
                "Access",
                "Price Paid",
                "Action",
              ].map((item) => (
                <th key={item} className="px-2 py-3 font-medium">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-2 py-8 text-center text-[#667085]">
                  Loading purchased leads...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="px-2 py-8 text-center text-[#d92d20]">
                  Unable to load your purchased leads. Please try again.
                </td>
              </tr>
            ) : !isAuthenticated ? (
              <tr>
                <td colSpan={7} className="px-2 py-8 text-center text-[#667085]">
                  Please sign in to view your purchased leads.
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-2 py-8 text-center text-[#667085]">
                  No purchased leads found.
                </td>
              </tr>
            ) : (
              results.map((purchasedLead) => {
                const leadType = purchasedLead.lead.category.name;
                const isExclusive = purchasedLead.priceType === "EXCLUSIVE";

                return (
                  <tr
                    key={purchasedLead.id}
                    className="border-b border-[#eff2f5] text-[#344054]"
                  >
                    <td className="px-2 py-2.5 font-medium">
                      FG-LD-{purchasedLead.lead.leadNumber}
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className={
                          "rounded px-1.5 py-1 " +
                          (leadTypeClass[leadType] || "bg-slate-100 text-slate-600")
                        }
                      >
                        {leadType}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      {purchasedLead.lead.propertyType || "—"}
                    </td>
                    <td className="max-w-[180px] px-2 py-2.5">
                      {getLocation(purchasedLead.lead) || "—"}
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className={
                          isExclusive
                            ? "rounded bg-[#ddf9e8] px-1.5 py-1 text-[#10a44c]"
                            : "rounded bg-[#e4f4ff] px-1.5 py-1 text-[#087ce7]"
                        }
                      >
                        {formatPriceType(purchasedLead.priceType)}
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      {formatCurrency(purchasedLead.pricePaid)}
                    </td>
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        onClick={() => onViewLead(purchasedLead)}
                        className="rounded border border-[#8dc7ff] px-1.5 py-1 text-[#087ce7]"
                      >
                        View Lead
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex justify-between text-[9px] text-[#98a2b3]">
        <span>
          Showing {firstResult}-{lastResult} of {meta?.total ?? 0} purchased leads
        </span>
        <div className="flex gap-2">
          {pageSizes.map((pageSize) => (
            <button
              key={pageSize}
              type="button"
              onClick={() => onLimitChange(pageSize)}
              className={
                limit === pageSize
                  ? "rounded border border-[#8dc7ff] px-2 py-1 text-[#087ce7]"
                  : "px-2 py-1"
              }
            >
              {pageSize}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!meta || page >= meta.totalPage}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default MyLeadsTable;
