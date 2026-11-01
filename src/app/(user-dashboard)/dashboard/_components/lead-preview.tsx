"use client";

import Image from "next/image";
import { CheckCircle2, Circle, Info, Lightbulb, X } from "lucide-react";

const previewDetails = [
  ["Property Type", "Single Family"], ["Estimated Value", "$685,000"], ["Estimated Equity", "$240,000"], ["Foreclosure Stage", "Notice of Default"],
  ["Phone Available", "Yes"], ["Email Available", "Yes"], ["Added", "3 Days Ago"], ["Owner", "J***** S*****"],
  ["Street Address", "Hidden Until Purchase"], ["Phone", "(***)***-1234"], ["Email", "J*****@gmail.com"], ["Shared", "$XX"], ["Exclusive", "$XX"],
];

const LeadPreview = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null;

  return (
    <aside data-lenis-prevent className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[410px] flex-col overflow-hidden border-l border-[#edf2f7] bg-white shadow-[-2px_0_3px_rgba(0,0,0,0.1)]" aria-label="Lead Preview">
      <header className="flex h-[75px] shrink-0 items-center justify-between border-b border-[rgba(219,236,255,0.7)] px-4">
        <h2 className="text-xl font-bold text-[#0f1839]">Lead Preview</h2>
        <button type="button" onClick={onClose} aria-label="Close lead preview" className="grid size-9 place-items-center rounded-md text-[#77839a] transition hover:bg-[#f3f6fa] hover:text-[#334155] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]"><X size={20} strokeWidth={1.8} /></button>
      </header>

      <div className="dashboard-summary-scroll min-h-0 flex-1 overflow-y-auto pb-6" data-lenis-prevent>
        <section className="px-4 pt-3">
          <div className="flex justify-end"><span className="rounded bg-[#e5eff9] px-2 py-1 text-xs font-medium text-[#177afe]">SAMPLE DATA ONLY</span></div>
          <div className="mt-8">
            <div className="flex items-center gap-2"><span className="rounded bg-[#fcdee0] px-2 py-1 text-xs font-medium text-[#8f4d4f]">Foreclosure</span><span className="rounded bg-[#d9fae9] px-2 py-1 text-xs font-medium text-[#05976a]">Shared Lead</span></div>
            <h3 className="mt-4 text-xl font-bold text-[#0f1839]">Orange Country, CA 928XX</h3>
            <p className="mt-2 text-sm font-medium text-[#878a9b]">Single Family Property</p>
          </div>
        </section>

        <section className="mt-4 px-4">
          <div className="relative h-[127px] overflow-hidden rounded-lg bg-[#e6edf5]"><Image src="/images/figma/lead-preview-property.png" alt="Single-family property in Orange County" fill sizes="410px" className="object-cover" priority /></div>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 py-1 text-xs font-medium">
            {previewDetails.map(([label, value]) => {
              const isAvailable = label === "Phone Available" || label === "Email Available";
              return <div key={label} className="contents"><dt className="text-[#878a9b]">{label}</dt><dd className={`flex items-center gap-1 ${isAvailable ? "text-[#0aa976]" : "text-black"}`}>{isAvailable && <CheckCircle2 size={16} aria-hidden="true" />}{value}</dd></div>;
            })}
          </dl>
        </section>

        <section className="mt-4 space-y-4 px-4">
          <div className="rounded-lg border border-[#ebf4ff] bg-[#eaf4ff] p-3"><p className="flex items-center gap-3 text-xs font-medium leading-5 text-[#333]"><Info className="shrink-0 text-[#087ce1]" size={20} />This is a protected preview. Purchase the lead to unlock full property and owner details.</p></div>
          <article className="rounded-2xl border border-[#cedcf0] bg-[#eaf4ff] p-3 shadow-sm"><div className="flex gap-3"><Circle className="mt-0.5 shrink-0 text-[#087ce1]" size={20} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-black">Shared Lead <span className="font-medium">• Limited Availability</span></p><p className="mt-1 text-xs font-medium text-[#333]">May be purchased by other users</p></div><b className="text-lg text-black">$25.00</b></div><button type="button" className="mt-3 flex h-9 w-full items-center justify-center rounded-md bg-[#0073df] px-3 text-base font-medium text-white transition hover:bg-[#0065c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2">Purchase Shared Lead</button></div></div></article>
          <article className="rounded-2xl border border-[#cedcf0] bg-white p-3 shadow-sm"><div className="flex gap-3"><Circle className="mt-0.5 shrink-0 text-[#8ca1b8]" size={20} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-black">Exclusive Lead</p><p className="mt-1 text-xs font-medium text-[#333]">Be the only customer to receive this lead</p></div><b className="text-lg text-black">$49.00</b></div><button type="button" className="mt-3 flex h-9 w-full items-center justify-center rounded-md border border-[#0073df] bg-[#eaf4ff] px-3 text-base font-medium text-[#0073df] transition hover:bg-[#dceeff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2">Purchase Exclusive Lead</button></div></div><p className="mt-4 flex items-center gap-3 rounded-lg bg-[#faf2e7] p-3 text-xs font-medium leading-5 text-[#734300]"><Lightbulb className="shrink-0" size={20} />Exclusive prevents future customers from purchasing this lead.</p></article>
          <p className="flex items-center gap-3 px-2 text-xs font-medium text-[#333]"><Info className="text-[#087ce1]" size={16} />Sample Data Only. Actual data varies.</p>
        </section>
      </div>
    </aside>
  );
};

export default LeadPreview;
