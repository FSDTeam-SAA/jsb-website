"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import LeadDetailsModal from "./lead-details-modal";
import MyLeadsTable from "./my-leads-table";
import RequestLeadReviewModal from "./request-lead-review-modal";

const MyLeadsContainers = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  return <main className="min-w-0 flex-1 bg-[#f6f9fd] px-4 py-5 md:px-6"><section className="mx-auto max-w-[1640px]"><h1 className="text-[18px] font-bold text-[#17212e]">My Leads</h1><p className="mt-1 text-[12px] text-[#667085]">Welcome back, John! Here&apos;s an overview of your account and the latest opportunities.</p><div className="mt-4 rounded-[8px] bg-white p-3 shadow-[0_2px_10px_rgba(31,61,96,0.04)]"><div className="flex items-center gap-2 border-b border-[#edf1f5] pb-3"><Bookmark size={19} className="text-[#344054]" /><div><h2 className="text-[14px] font-bold text-[#17212e]">Purchased Leads</h2><p className="text-[9px] text-[#667085]">125 purchased leads</p></div></div><div className="mt-4"><MyLeadsTable onViewLead={() => setDetailsOpen(true)} /></div></div></section><LeadDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} onRequestReview={() => { setDetailsOpen(false); setReviewOpen(true); }} /><RequestLeadReviewModal open={reviewOpen} onClose={() => setReviewOpen(false)} /></main>;
};

export default MyLeadsContainers;
