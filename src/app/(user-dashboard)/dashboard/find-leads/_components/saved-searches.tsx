"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ArrowRight, Clock3, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "@/components/modals/delete-modal";
import {
  deleteSavedSearch,
  getNewMatchingLeads,
  getSavedSearches,
  type SavedSearch,
} from "@/lib/saved-search-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const filterSummary = (filters: SavedSearch["filters"]) => {
  const parts = [
    filters.searchTerm && `Search: ${filters.searchTerm}`,
    filters.city,
    filters.state,
    filters.propertyType,
    filters.availability?.map((value) => value[0] + value.slice(1).toLowerCase()).join(", "),
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "All marketplace leads";
};

const SavedSearches = ({ onViewResults }: { onViewResults: (savedSearch: SavedSearch) => void }) => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const [searchToDelete, setSearchToDelete] = useState<SavedSearch | null>(null);
  const [searchWithNewLeads, setSearchWithNewLeads] = useState<SavedSearch | null>(null);
  const savedSearchesQuery = useQuery({
    queryKey: ["saved-searches", accessToken],
    queryFn: () => getSavedSearches(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      if (!accessToken) throw new Error("Please sign in to delete a saved search.");
      return deleteSavedSearch(accessToken, id);
    },
    onSuccess: (response) => {
      setSearchToDelete(null);
      void queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
      toast.success(response.message || "Saved search deleted successfully.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to delete the saved search."),
  });
  const searches = savedSearchesQuery.data?.data ?? [];
  const newLeadsQuery = useQuery({
    queryKey: ["saved-searches", "new-leads", accessToken, searchWithNewLeads?.id],
    queryFn: () => getNewMatchingLeads(accessToken!, searchWithNewLeads!.id),
    enabled: Boolean(accessToken && searchWithNewLeads),
    staleTime: 60_000,
  });
  const newLeads = newLeadsQuery.data?.data;

  if (status === "loading" || savedSearchesQuery.isLoading) return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-40 animate-pulse rounded-[8px] bg-[#edf2f7]" />)}</div>;
  if (savedSearchesQuery.isError || status === "unauthenticated") return <div role="alert" className="rounded-lg border border-[#f1c5c5] bg-[#fff7f7] p-5 text-center text-sm text-[#8c311e]">Saved searches could not be loaded.<button type="button" onClick={() => savedSearchesQuery.refetch()} className="ml-2 underline">Try again</button></div>;
  if (!searches.length) return <div className="rounded-lg border border-dashed border-[#b7c9dc] bg-[#f7fbff] p-8 text-center"><h2 className="text-sm font-bold text-[#104170]">No saved searches yet</h2><p className="mt-1 text-xs text-[#38526e]">Apply filters, then use Save Search to keep them here.</p></div>;

  return <>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{searches.map((search) => <article key={search.id} className="rounded-[8px] border border-[#e5eaf0] bg-white p-4 shadow-sm"><div><h2 className="truncate text-[14px] font-bold text-[#17212e]">{search.title}</h2><p className="mt-1 line-clamp-2 text-[10px] text-[#667085]">{filterSummary(search.filters)}</p></div><div className="mt-4 flex justify-between text-[9px] text-[#98a2b3]"><span>Updated {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(search.updatedAt))}</span></div><div className="mt-3 grid grid-cols-3 gap-2"><button type="button" onClick={() => setSearchWithNewLeads(search)} className="flex h-8 items-center justify-center gap-1 rounded-[4px] border border-[#b9dafa] bg-[#f4faff] text-[10px] font-medium text-[#087ce7] hover:bg-[#e7f4ff]">New <Clock3 size={11} /></button><button type="button" onClick={() => onViewResults(search)} className="flex h-8 items-center justify-center gap-1 rounded-[4px] bg-[#087ce7] text-[10px] text-white">View <ArrowRight size={12} /></button><button type="button" onClick={() => setSearchToDelete(search)} disabled={deleteMutation.isPending} className="flex h-8 items-center justify-center gap-1 rounded-[4px] bg-[#fff0f1] text-[10px] text-[#ed2532] disabled:opacity-60">Delete <Trash2 size={11} /></button></div></article>)}</div>
    <DeleteModal isOpen={Boolean(searchToDelete)} onClose={() => setSearchToDelete(null)} onConfirm={() => searchToDelete && deleteMutation.mutate(searchToDelete.id)} isPending={deleteMutation.isPending} title="Delete Saved Search?" desc={`Are you sure you want to delete “${searchToDelete?.title ?? ""}”? This action cannot be undone.`} />
    <Dialog open={Boolean(searchWithNewLeads)} onOpenChange={(open) => !open && setSearchWithNewLeads(null)}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-xl bg-white p-5 sm:max-w-[560px]" showCloseButton>
        <DialogHeader className="pr-8">
          <span className="grid size-10 place-items-center rounded-full bg-[#edf7ff] text-[#087ce7]">
            <Sparkles aria-hidden="true" size={20} />
          </span>
          <DialogTitle className="mt-2 text-lg font-bold text-[#17212e]">New matching leads</DialogTitle>
          <DialogDescription className="leading-5 text-[#667085]">
            Leads added in the last 24 hours for “{searchWithNewLeads?.title}”.
          </DialogDescription>
        </DialogHeader>

        {newLeadsQuery.isLoading ? (
          <div className="space-y-2" aria-label="Loading new matching leads">
            {[1, 2, 3].map((row) => <div key={row} className="h-16 animate-pulse rounded-lg bg-[#edf2f7]" />)}
          </div>
        ) : newLeadsQuery.isError ? (
          <div role="alert" className="rounded-lg border border-[#f1c5c5] bg-[#fff7f7] p-4 text-center">
            <p className="text-sm font-medium text-[#8c311e]">New leads could not be loaded.</p>
            <button type="button" onClick={() => newLeadsQuery.refetch()} className="mt-2 text-sm font-semibold text-[#087ce7] hover:underline">Try again</button>
          </div>
        ) : newLeads ? (
          <div>
            <p className="rounded-lg bg-[#f4faff] px-3 py-2 text-sm font-semibold text-[#104170]">
              {newLeads.newLeadsCount} {newLeads.newLeadsCount === 1 ? "new lead" : "new leads"} found
            </p>
            {newLeads.newLeads.length ? (
              <div className="mt-3 space-y-2">
                {newLeads.newLeads.map((lead) => {
                  const location = [lead.city ?? lead.county, lead.state, lead.zipcode].filter(Boolean).join(", ") || "Location unavailable";
                  return <article key={lead.id} className="rounded-lg border border-[#e5eaf0] px-3 py-2.5"><p className="text-sm font-semibold text-[#17212e]">{location}</p><p className="mt-1 text-xs text-[#667085]">{[lead.propertyType, lead.stage, lead.category.name].filter(Boolean).join(" · ")}</p></article>;
                })}
                {newLeads.newLeadsCount > newLeads.newLeads.length ? <p className="pt-1 text-center text-xs text-[#667085]">Showing the newest {newLeads.newLeads.length} of {newLeads.newLeadsCount} leads.</p> : null}
              </div>
            ) : <p className="py-7 text-center text-sm text-[#667085]">No new leads matched this search in the last 24 hours.</p>}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  </>;
};

export default SavedSearches;
