"use client";

import { useState } from "react";
import LeadPreviewController from "../../_components/lead-preview-controller";
import BulkOrderModal from "./bulk-order-modal";
import FindLeadsFilter from "./find-leads-filter";
import FindLeadsResults from "./find-leads-results";
import SavedSearches from "./saved-searches";

const FindLeadsContainer = () => {
  const [activeTab, setActiveTab] = useState<"search" | "saved">("search");
  const [bulkOrderOpen, setBulkOrderOpen] = useState(false);
  return <main className="min-w-0 flex-1 bg-[#f6f9fd] px-4 py-5 md:px-6"><section className="mx-auto max-w-[1640px]"><h1 className="text-[18px] font-bold text-[#17212e]">Find Leads</h1><p className="mt-1 text-[12px] text-[#667085]">Search, filter and save thousands of foreclosure, pre foreclosure and distressed property leads nationwide.</p>
    <div className="mt-4 rounded-[8px] bg-white p-3 shadow-[0_2px_10px_rgba(31,61,96,0.04)]"><div className="flex border-b border-[#edf1f5] pl-0 text-[11px]"><button onClick={() => setActiveTab("search")} className={`px-2 py-3 ${activeTab === "search" ? "border-b-2 border-[#087ce7] font-medium text-[#104170]" : "text-[#98a2b3]"}`}>Search Leads</button><button onClick={() => setActiveTab("saved")} className={`px-2 py-3 ${activeTab === "saved" ? "border-b-2 border-[#087ce7] font-medium text-[#104170]" : "text-[#98a2b3]"}`}>Saved Search Leads</button></div>
      {activeTab === "search" ? <div className="mt-3 flex gap-3"><FindLeadsFilter /><FindLeadsResults onBulkOrder={() => setBulkOrderOpen(true)} /></div> : <div className="mt-4"><SavedSearches /></div>}
    </div></section><LeadPreviewController /><BulkOrderModal open={bulkOrderOpen} onClose={() => setBulkOrderOpen(false)} /></main>;
};

export default FindLeadsContainer;
