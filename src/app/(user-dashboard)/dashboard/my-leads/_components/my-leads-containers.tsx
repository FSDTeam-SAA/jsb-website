"use client";

import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import {
  getMyPurchasedLeads,
  type PurchasedLead,
} from "@/lib/purchased-leads-api";

import LeadDetailsModal from "./lead-details-modal";
import MyLeadsTable from "./my-leads-table";
import RequestLeadReviewModal from "./request-lead-review-modal";

const MyLeadsContainers = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const [selectedLead, setSelectedLead] = useState<PurchasedLead | null>(null);
  const [reviewLead, setReviewLead] = useState<PurchasedLead | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const purchasedLeadsQuery = useQuery({
    queryKey: ["leads", "my-leads", accessToken, page, limit],
    queryFn: () => getMyPurchasedLeads(accessToken!, { page, limit }),
    enabled: status === "authenticated" && Boolean(accessToken),
  });
  const meta = purchasedLeadsQuery.data?.meta;

  return (
    <main className="min-w-0 flex-1 bg-[#f6f9fd] px-4 py-5 md:px-6">
      <section className="mx-auto max-w-[1640px]">
        <h1 className="text-xl font-bold text-[#17212e]">My Leads</h1>
        <p className="mt-1 text-[12px] text-[#667085]">
          View the leads you have purchased and their complete property details.
        </p>
        <div className="mt-4 rounded-[8px] bg-white p-3 shadow-[0_2px_10px_rgba(31,61,96,0.04)]">
          <div className="flex items-center gap-2 border-b border-[#edf1f5] pb-3">
            <Bookmark size={19} className="text-[#344054]" />
            <div>
              <h2 className="text-[14px] font-bold text-[#17212e]">Purchased Leads</h2>
              <p className="text-[9px] text-[#667085]">
                {meta
                  ? `${meta.total} purchased lead${meta.total === 1 ? "" : "s"}`
                  : "Your purchased leads"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <MyLeadsTable
              leads={purchasedLeadsQuery.data?.data ?? []}
              meta={meta}
              page={page}
              limit={limit}
              isLoading={purchasedLeadsQuery.isLoading || status === "loading"}
              isError={purchasedLeadsQuery.isError}
              isAuthenticated={status === "authenticated" && Boolean(accessToken)}
              onPageChange={setPage}
              onLimitChange={(nextLimit) => {
                setLimit(nextLimit);
                setPage(1);
              }}
              onViewLead={setSelectedLead}
            />
          </div>
        </div>
      </section>
      <LeadDetailsModal
        lead={selectedLead}
        open={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onRequestReview={() => {
          setReviewLead(selectedLead);
          setSelectedLead(null);
          setReviewOpen(true);
        }}
      />
      <RequestLeadReviewModal
        open={reviewOpen}
        leadId={reviewLead?.leadId}
        onClose={() => {
          setReviewOpen(false);
          setReviewLead(null);
        }}
      />
    </main>
  );
};

export default MyLeadsContainers;
