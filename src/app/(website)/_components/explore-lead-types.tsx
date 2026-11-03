"use client";

import { useQuery } from "@tanstack/react-query";
import { BadgeDollarSign, Building2, FileSearch, House, HouseHeart, HousePlus, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

type Category = {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  isActive: boolean;
  agePricingEnabled: boolean;
  sharedBasePrice: number | string | null;
  exclusiveBasePrice: number | string | null;
  createdAt: string;
  updatedAt: string;
};

const getCategories = () => apiRequest<Category[]>("/categories");
const INITIAL_CATEGORY_COUNT = 6;

const categoryIcons: Record<string, LucideIcon> = {
  "pre-foreclosure": HousePlus,
  "foreclosure auction": Building2,
  "bank owned / reo": House,
  "tax deed auction": BadgeDollarSign,
  "short sale": HouseHeart,
};

const iconForCategory = (name: string) =>
  categoryIcons[name.trim().toLowerCase()] ?? FileSearch;

const LeadTypeCardSkeleton = () => (
  <article aria-hidden="true" className="flex h-[220px] animate-pulse flex-col rounded-[18px] border border-black/10 p-4 shadow-[0_0_2px_rgba(0,0,0,0.25)] lg:h-[310px] lg:p-10">
    <div className="size-[38px] rounded-[6px] bg-[#d1e4f6] lg:size-[72px] lg:rounded-xl" />
    <div className="mt-6 h-5 w-3/4 rounded bg-[#e8edf4] lg:h-7" />
    <div className="mt-2 h-3 w-full rounded bg-[#edf1f6] lg:h-4" />
    <div className="mt-2 h-3 w-4/5 rounded bg-[#edf1f6] lg:h-4" />
    <div className="mt-auto h-9 w-24 rounded-[8px] bg-[#e8edf4]" />
  </article>
);

const CategoriesError = ({ retry }: { retry: () => void }) => (
  <div role="alert" className="mx-auto mt-8 max-w-xl rounded-xl border border-[#f1c5c5] bg-[#fff7f7] px-6 py-8 text-center">
    <h3 className="text-lg font-bold text-[#8c311e]">Lead types could not be loaded</h3>
    <p className="mt-2 text-sm text-[#5d3830]">Please check your connection and try again.</p>
    <button type="button" onClick={retry} className="mt-5 inline-flex h-10 items-center justify-center rounded-[7px] bg-[#104170] px-5 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">
      Try again
    </button>
  </div>
);

const CategoriesNotFound = () => (
  <div className="mx-auto mt-8 max-w-xl rounded-xl border border-dashed border-[#b7c9dc] bg-[#f7fbff] px-6 py-8 text-center">
    <h3 className="text-lg font-bold text-[#104170]">No lead types are available</h3>
    <p className="mt-2 text-sm text-[#38526e]">Please check back soon for available marketplace categories.</p>
  </div>
);

const ExploreLeadTypes = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
  const categories = categoriesQuery.data?.data ?? [];
  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, INITIAL_CATEGORY_COUNT);

  return (
    <section
      id="lead-types"
      aria-labelledby="lead-types-heading"
      className="scroll-mt-24 bg-white py-8 sm:scroll-mt-28 sm:py-12 lg:py-[60px]"
    >
      <div className="container mx-auto px-4 lg:px-0">
        <header className="text-center">
          <p className="inline-flex h-[30px] items-center rounded-[8px] bg-[#d1e4f6] px-3 text-xs font-medium text-[#104170] lg:text-sm">
            Categories
          </p>
          <h2 id="lead-types-heading" className="mt-3 text-2xl font-bold leading-none tracking-[-0.04em] text-[#104170] lg:text-[40px]">
            Explore Lead Types
          </h2>
          <p className="mx-auto mt-3 max-w-[524px] text-xs font-normal leading-[1.15] text-black lg:text-sm">
            Find the right lead opportunities for your business through multiple categories available in the Foreclosure Gold marketplace.
          </p>
        </header>

        {categoriesQuery.isLoading && (
          <div aria-label="Loading lead types" className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-12">
            {Array.from({ length: 6 }, (_, index) => <LeadTypeCardSkeleton key={index} />)}
          </div>
        )}

        {categoriesQuery.isError && <CategoriesError retry={() => categoriesQuery.refetch()} />}
        {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length === 0 && <CategoriesNotFound />}

        {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-12">
              {visibleCategories.map((category) => {
                const Icon = iconForCategory(category.name);

                return (
                  <article key={category.id} className="flex h-[220px] flex-col rounded-[18px] border border-black/10 p-4 shadow-[0_0_2px_rgba(0,0,0,0.25)] lg:h-[310px] lg:p-10">
                    <span className="flex size-[38px] items-center justify-center rounded-[6px] border border-[#bcd8f2] bg-[#d1e4f6] text-[#104170] lg:size-[72px] lg:rounded-xl">
                      <Icon aria-hidden="true" size={24} strokeWidth={2.4} className="lg:scale-150" />
                    </span>
                    <h3 className="mt-6 text-base font-bold leading-none tracking-[-0.035em] text-[#104170] lg:text-2xl">
                      {category.name}
                    </h3>
                    <p className="mt-1 max-w-[240px] text-xs font-medium leading-[1.2] text-black lg:text-sm">
                      {category.description || "Explore lead opportunities in this category."}
                    </p>
                    <Link
                      href="#create-your-book"
                      className="mt-auto inline-flex h-9 w-fit items-center justify-center rounded-[8px] bg-[#104170] px-3 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
                    >
                      Find Leads
                    </Link>
                  </article>
                );
              })}
            </div>

            {categories.length > INITIAL_CATEGORY_COUNT && !showAllCategories && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllCategories(true)}
                className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[#104170] px-3 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
              >
                Explore all Leads Type
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ExploreLeadTypes;
