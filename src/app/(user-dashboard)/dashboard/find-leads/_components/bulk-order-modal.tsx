"use client";

import { Info, X } from "lucide-react";
import { useState } from "react";

const BulkOrderModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [kind, setKind] = useState("Shared");
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}><section role="dialog" aria-modal="true" className="w-full max-w-[520px] rounded-[8px] bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-[15px] font-bold text-[#104170]">Bulk Order</h2><button onClick={onClose} aria-label="Close bulk order"><X size={17} className="text-[#667085]" /></button></div><p className="mt-4 text-[11px] text-[#344054]">Add matching leads</p><p className="text-[11px] text-[#667085]">2,847 Matching Leads</p><div className="mt-3 grid grid-cols-2 gap-2">{["Shared", "Exclusive"].map((value) => <button key={value} onClick={() => setKind(value)} className={`h-9 rounded-[5px] text-[14px] ${kind === value ? "border border-[#104170] bg-[#e7f2ff] text-[#104170]" : "bg-[#fafafa] text-[#858585]"}`}>{value}</button>)}</div><label className="mt-3 block text-[10px] text-[#667085]">Quantity<input defaultValue="250" className="mt-1 h-8 w-full rounded border border-[#98a2b3] px-2 text-[10px]" /></label><div className="mt-3 flex gap-2 rounded-[5px] bg-[#e7f2ff] p-2 text-[9px] text-[#344054]"><Info size={14} className="shrink-0 text-[#087ce7]" />Previously purchased and unavailable leads are automatically excluded. Shared and Exclusive batches remain separate in cart.</div><button onClick={onClose} className="mt-3 h-9 w-full rounded-[4px] bg-[#087ce7] text-[10px] font-medium text-white">Add 250 Leads to Cart</button></section></div>;
};

export default BulkOrderModal;
