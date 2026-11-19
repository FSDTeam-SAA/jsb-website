"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categoryHref, publicCategoriesQueryOptions } from "@/lib/public-categories";

export default function OtherLeadTypes() {
  const pathname = usePathname();
  const { data, isPending, isError, refetch } = useQuery(publicCategoriesQueryOptions);

  return (
    <nav className="rounded-[12px] border border-[#dde6f0] bg-[#f4f7fb] px-[25px] py-[29px]" aria-label="Other lead types">
      <h2 className="text-[18.7px] font-bold text-[#1c2a3a]">Other Lead Types</h2>
      {isPending && <p role="status" className="mt-2 text-sm text-[#4a5f74]">Loading categories…</p>}
      {isError && (
        <button type="button" onClick={() => void refetch()} className="mt-2 text-sm font-bold text-[#104170] hover:underline">
          Retry loading categories
        </button>
      )}
      {data?.length === 0 && !isError && (
        <p className="mt-2 text-sm text-[#4a5f74]">No categories available</p>
      )}
      {!!data?.length && (
        <ul className="mt-2 space-y-1">
          {data.map(({ id, name }) => {
            const href = categoryHref(id);

            return (
              <li key={id}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className="flex min-h-10 items-center justify-between border-b border-[#dde6f0] py-[10px] text-[14px] font-bold text-[#4a5f74] transition hover:text-[#104170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] aria-[current=page]:text-[#104170]"
                >
                  {name}
                  <span aria-hidden="true">›</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
