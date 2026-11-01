import { Crown, Download, Info } from "lucide-react";
import AccountPanelFrame from "./account-panel-frame";

const plans = [
  ["Free", "$0", "0%"],
  ["Silver", "$49", "5%"],
  ["Gold", "$99", "10%"],
  ["Diamond", "$149", "15%"],
];

const InvoiceHistory = () => (
  <section className="mt-6 overflow-x-auto rounded-[8px] border border-[#e4eaf8]">
    <h3 className="border-b border-[#e4eaf8] p-4 text-xl font-bold text-[#0e1224]">Invoice History</h3>
    <div className="min-w-[760px] divide-y divide-[#e4eaf8] text-sm">
      <div className="grid grid-cols-5 bg-[#f5f7ff] px-4 py-3 font-medium text-[#545454]">
        <span>Plan Name</span><span>Date</span><span>Amount</span><span>Status</span><span>Actions</span>
      </div>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="grid grid-cols-5 items-center px-4 py-3 text-[#1b1b3a]">
          <span>Silver</span><span>July 2026</span><span>$49.00</span>
          <span><b className="inline-flex items-center gap-1 rounded-[8px] bg-[#ecfdf3] px-2 py-1 font-medium text-[#10b981]"><i className="size-2 rounded-full bg-[#10b981]" />Paid</b></span>
          <button className="flex items-center gap-1 text-[#5b7ff0]"><Download size={14} />Download Invoice</button>
        </div>
      ))}
    </div>
  </section>
);

const SubscriptionPanel = () => (
  <AccountPanelFrame title="Subscription Plan">
    <div className="rounded-[12px] border border-[#f5dca5] p-4">
      <div className="flex items-center gap-4">
        <span className="grid size-12 place-items-center rounded-full bg-[#fff2d6] text-[#d79411]"><Crown size={24} /></span>
        <div><p className="text-sm text-[#545454]">Current Membership</p><h3 className="mt-1 text-xl font-bold text-[#0e1224]">Gold Member</h3><p className="mt-1 text-sm font-medium text-[#b58400]">10% Lead Discount</p></div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#e4eaf8] pt-4 text-sm">
        <p>Membership status <b className="ml-2 text-[#10b981]">Active</b></p>
        <p>Next Billing Date <b className="ml-2 text-[#141936]">October 31, 2026</b></p>
        <button className="rounded-[6px] border border-[#ef4444] px-3 py-2 font-medium text-[#ef4444]">Cancel Membership</button>
      </div>
      <p className="mt-4 flex gap-2 rounded-[8px] bg-[#f5f7ff] p-3 text-sm text-[#104170]"><Info size={18} className="shrink-0" />Your paid membership remains active until the end of your billing period. After that, your account switches to Free.</p>
    </div>
    <h3 className="mt-6 text-xl font-bold text-[#0e1224]">Compare Plans</h3>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {plans.map(([name, price, discount]) => (
        <article key={name} className={`rounded-[8px] border p-4 text-center ${name === "Gold" ? "border-[#0073df] ring-1 ring-[#0073df]" : "border-[#d9dde5]"}`}>
          <h4 className="text-xl font-bold">{name}</h4><p className="mt-5 text-4xl font-bold">{price}<span className="text-sm">/month</span></p>
          <div className="mt-5 rounded-[8px] bg-[#f5f7ff] py-3 text-[#104170]"><b className="text-lg">{discount}</b><p className="mt-1 text-sm">Lead Discount</p></div>
          <button className="mt-4 h-12 rounded-[6px] bg-[#104170] px-4 text-sm font-medium text-white">{name === "Free" ? "Create Account" : "Choose Plan"}</button>
        </article>
      ))}
    </div>
    <InvoiceHistory />
  </AccountPanelFrame>
);

export default SubscriptionPanel;
