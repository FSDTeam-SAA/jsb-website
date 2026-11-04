"use client";

import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { getSavedSearches } from "@/lib/saved-search-api";

const formatSavedDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const SavedSearchesCard = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const savedSearchesQuery = useQuery({
    queryKey: ["saved-searches", "recent", accessToken],
    queryFn: () => getSavedSearches(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 60_000,
  });
  const searches = [...(savedSearchesQuery.data?.data ?? [])]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <article className="overflow-hidden rounded-2xl border border-[#ebf4ff] bg-white">
      <CardHeader />
      <div className="space-y-2 px-3 py-2">
        {status === "loading" || savedSearchesQuery.isLoading ? (
          <SavedSearchesSkeleton />
        ) : status !== "authenticated" || !accessToken ? (
          <CardMessage message="Sign in to view your saved searches." />
        ) : savedSearchesQuery.isError ? (
          <CardMessage
            message="Saved searches could not be loaded."
            actionLabel="Try again"
            onAction={() => savedSearchesQuery.refetch()}
          />
        ) : searches.length === 0 ? (
          <CardMessage message="No saved searches yet." />
        ) : (
          searches.map((search) => (
            <Link
              key={search.id}
              href="/dashboard/find-leads"
              className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-[#eaeaea] px-2.5 text-xs transition-colors hover:border-[#b9dafa] hover:bg-[#f8fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1779fe]"
            >
              <span className="truncate font-medium text-[#141936]">{search.title}</span>
              <span className="shrink-0 text-[#878a9b]">
                Saved {formatSavedDate(search.createdAt)}
              </span>
            </Link>
          ))
        )}
      </div>
    </article>
  );
};

const CardHeader = () => (
  <div className="flex h-[52px] items-center justify-between border-b-2 border-[#f1f4f9] px-3">
    <div className="flex items-center gap-1">
      <Bookmark size={24} className="text-[#087ce7]" />
      <h2 className="text-sm font-bold text-black">Saved Searches</h2>
    </div>
    <Link href="/dashboard/find-leads" className="text-xs font-semibold text-[#1779fe]">
      View All
    </Link>
  </div>
);

const SavedSearchesSkeleton = () => (
  <div className="space-y-2" aria-label="Loading saved searches">
    {[1, 2, 3].map((row) => (
      <div
        key={row}
        className="flex h-11 items-center justify-between rounded-lg border border-[#eaeaea] px-2.5"
      >
        <span className="h-3 w-3/5 animate-pulse rounded bg-[#edf2f7]" />
        <span className="h-3 w-16 animate-pulse rounded bg-[#edf2f7]" />
      </div>
    ))}
  </div>
);

const CardMessage = ({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="py-7 text-center">
    <p className="text-xs text-[#667085]">{message}</p>
    {actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="mt-2 rounded-md text-xs font-semibold text-[#087ce7] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1779fe]"
      >
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default SavedSearchesCard;
