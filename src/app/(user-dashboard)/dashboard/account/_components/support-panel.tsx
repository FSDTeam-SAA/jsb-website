import AccountPanelFrame, { fieldClass } from "./account-panel-frame";

const tickets = ["TID-0052", "TID-0053", "TID-0056", "TID-0055", "TID-0054", "TID-0057"];

const SupportHistory = () => (
  <section className="mt-6 overflow-x-auto rounded-[8px] border border-[#e4eaf8]">
    <h3 className="border-b border-[#e4eaf8] p-4 text-xl font-bold text-[#0e1224]">History</h3>
    <div className="min-w-[660px] divide-y divide-[#e4eaf8] text-sm">
      <div className="grid grid-cols-4 bg-[#f5f7ff] px-4 py-3 font-medium text-[#545454]"><span>Ticket ID</span><span>Date</span><span>Subject</span><span>Status</span></div>
      {tickets.map((id, index) => {
        const inProgress = index === 1;
        const date = index === 1 ? "15" : index === 2 ? "30" : index === 3 ? "25" : "20";
        return <div key={id} className="grid grid-cols-4 items-center px-4 py-3 text-[#1b1b3a]"><span>{id}</span><span>{date} July 2026</span><span>Account / Billing</span><span><b className={`inline-flex items-center gap-1 rounded-[8px] px-2 py-1 font-medium ${inProgress ? "bg-[#fff7e6] text-[#efae00]" : "bg-[#ecfdf3] text-[#10b981]"}`}><i className={`size-2 rounded-full ${inProgress ? "bg-[#efae00]" : "bg-[#10b981]"}`} />{inProgress ? "In Progress" : "Resolved"}</b></span></div>;
      })}
    </div>
  </section>
);

const SupportPanel = () => (
  <AccountPanelFrame title="Contact & Support">
    <label className="block text-base font-medium text-[#104170]">Category<select className={fieldClass}><option>Account / Billing</option></select></label>
    <label className="mt-4 block text-base font-medium text-[#104170]">Message<textarea placeholder="Tell us how we can help..." className="mt-2 h-32 w-full resize-none rounded-[12px] border-0 bg-[#f5f7ff] p-4 text-base text-[#505050] outline-none" /></label>
    <button className="mt-4 flex h-12 items-center rounded-[6px] bg-[#0073df] px-5 text-base font-medium text-white">Send Message</button>
    <p className="mt-3 text-sm text-[#667085]">Billing errors are reviewed for a payment refund when appropriate.</p>
    <SupportHistory />
  </AccountPanelFrame>
);

export default SupportPanel;
