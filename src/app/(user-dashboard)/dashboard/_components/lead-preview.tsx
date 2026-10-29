"use client";

import Image from "next/image";
import { CheckCircle2, Circle, Info, X } from "lucide-react";
import { Fragment } from "react";

const LeadPreview = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-[#0d1f35]/55" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-[500px] overflow-y-auto bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        aria-label="Lead Preview"
      >
        <div className="flex items-center justify-between border-b border-[#edf1f5] pb-4">
          <h2 className="text-[16px] font-bold text-[#17212e]">Lead Preview</h2>
          <button onClick={onClose} aria-label="Close lead preview">
            <X size={18} className="text-[#98a2b3]" />
          </button>
        </div>
        <div className="mt-5 flex justify-end">
          <span className="rounded bg-[#e7f2ff] px-2 py-1 text-[9px] text-[#087ce7]">
            SAMPLE DATA ONLY
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <span className="rounded bg-[#ffe9ed] px-2 py-1 text-[10px] text-[#fb5570]">
            Foreclosure
          </span>
          <span className="rounded bg-[#dff8f7] px-2 py-1 text-[10px] text-[#00a77a]">
            Shared Lead
          </span>
        </div>
        <h3 className="mt-3 text-[19px] font-bold text-[#17212e]">
          Orange County, CA 928XX
        </h3>
        <p className="mt-1 text-[11px] text-[#667085]">
          Single Family Property
        </p>
        <div className="relative mt-4 h-[170px] overflow-hidden rounded-[6px] bg-[#dfeaf5]">
          <Image
            src="/images/auth_bg.png"
            alt="Property preview"
            fill
            className="object-cover object-bottom"
          />
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-y-2 border-b border-[#edf1f5] pb-4 text-[11px]">
          {[
            ["Property Type", "Single Family"],
            ["Estimated Value", "$665,000"],
            ["Estimated Equity", "$240,000"],
            ["Foreclosure Stage", "Notice Of Default"],
            ["Phone Available", "Yes"],
            ["Email Available", "Yes"],
            ["Added", "3 Days Ago"],
            ["Source", "******* Purchase"],
            ["Street Address", "Hidden Until Purchase"],
            ["Phone", "***-***-1234"],
            ["Email", "j***@gmail.com"],
            ["Shared", "$XX"],
          ].map(([label, value]) => (
            <Fragment key={label}>
              <span className="text-[#667085]">{label}</span>
              <span className="flex items-center justify-end gap-1 font-medium text-[#344054]">
                {(label === "Phone Available" ||
                  label === "Email Available") && (
                  <CheckCircle2 size={12} className="text-[#00a77a]" />
                )}
                {value}
              </span>
            </Fragment>
          ))}
        </div>
        <div className="mt-4 rounded-[8px] bg-[#e7f2ff] p-3 text-[11px] text-[#475467]">
          <div className="flex gap-2">
            <Info size={15} className="shrink-0 text-[#087ce7]" />
            This is a protected preview. Purchase the lead to unlock full
            property and owner details.
          </div>
        </div>
        <div className="mt-4 rounded-[8px] border border-[#e1e8f0] p-3">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1 text-[11px] font-semibold">
              <Circle size={14} /> Shared Lead{" "}
              <span className="font-normal text-[#667085]">
                • Limited Availability
              </span>
            </p>
            <b className="text-[16px]">$25.00</b>
          </div>
          <p className="mt-1 text-[10px] text-[#667085]">
            May be purchased by multiple users
          </p>
          <button className="mt-3 h-9 w-full rounded-[4px] bg-[#087ce7] text-[11px] font-medium text-white">
            Purchase Shared Lead
          </button>
        </div>
        <div className="mt-3 rounded-[8px] border border-[#e1e8f0] p-3">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1 text-[11px] font-semibold">
              <Circle size={14} /> Exclusive Lead
            </p>
            <b className="text-[16px]">$49.00</b>
          </div>
          <p className="mt-1 text-[10px] text-[#667085]">
            Be the only customer to receive this lead
          </p>
          <button className="mt-3 h-9 w-full rounded-[4px] border border-[#087ce7] text-[11px] font-medium text-[#087ce7]">
            Purchase Exclusive Lead
          </button>
        </div>
      </aside>
    </div>
  );
};

export default LeadPreview;
