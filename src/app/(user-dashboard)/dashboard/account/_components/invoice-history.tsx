import { Download } from "lucide-react";

const InvoiceHistory = () => (
  <section className="mt-6 overflow-hidden rounded-[8px] border border-[#e4eaf8] sm:overflow-x-auto">
    <h3 className="border-b border-[#e4eaf8] p-4 text-xl font-bold text-[#0e1224]">Invoice History</h3>
    <div className="space-y-3 p-3 sm:hidden">
      {Array.from({ length: 6 }, (_, index) => (
        <article key={index} className="rounded-lg border border-[#e4eaf8] bg-[#fafcff] p-3 text-sm text-[#1b1b3a]">
          <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">Silver</p><p className="mt-1 text-xs text-[#667085]">July 2026</p></div><b className="text-[#104170]">$49.00</b></div>
          <div className="mt-3 flex items-center justify-between gap-3"><b className="inline-flex items-center gap-1 rounded-[8px] bg-[#ecfdf3] px-2 py-1 text-xs font-medium text-[#10b981]"><i className="size-2 rounded-full bg-[#10b981]" />Paid</b><button className="flex items-center gap-1 text-xs font-medium text-[#5b7ff0]"><Download size={14} />Invoice</button></div>
        </article>
      ))}
    </div>
    <div className="hidden min-w-[760px] divide-y divide-[#e4eaf8] text-sm sm:block">
      <div className="grid grid-cols-5 bg-[#f5f7ff] px-4 py-3 font-medium text-[#545454]"><span>Plan Name</span><span>Date</span><span>Amount</span><span>Status</span><span>Actions</span></div>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="grid grid-cols-5 items-center px-4 py-3 text-[#1b1b3a]"><span>Silver</span><span>July 2026</span><span>$49.00</span><span><b className="inline-flex items-center gap-1 rounded-[8px] bg-[#ecfdf3] px-2 py-1 font-medium text-[#10b981]"><i className="size-2 rounded-full bg-[#10b981]" />Paid</b></span><button className="flex items-center gap-1 text-[#5b7ff0]"><Download size={14} />Download Invoice</button></div>
      ))}
    </div>
  </section>
);

export default InvoiceHistory;
