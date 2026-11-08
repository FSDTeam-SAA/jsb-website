"use client";

import { useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import { useSession } from "next-auth/react";
import { getMyInvoices } from "@/lib/auth-api";

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
  }).format(Number(amount));

const statusClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-[#ecfdf3] text-[#10b981]";
    case "pending":
      return "bg-[#fff7e6] text-[#d79411]";
    default:
      return "bg-[#fff1f0] text-[#dc2626]";
  }
};

const InvoiceStatus = ({ status }: { status: string }) => (
  <b className={`inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-medium ${statusClasses(status)}`}>
    <i className="size-2 rounded-full bg-current" />
    {status}
  </b>
);

// Invoice download actions are intentionally hidden until receipt downloads are enabled.

const InvoiceHistorySkeleton = () => (
  <section aria-label="Loading invoice history" className="mt-6 overflow-hidden rounded-[8px] border border-[#e4eaf8]">
    <h3 className="border-b border-[#e4eaf8] p-4 text-xl font-bold text-[#0e1224]">Invoice History</h3>
    <div className="space-y-3 p-3 sm:hidden">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="animate-pulse rounded-lg border border-[#e4eaf8] bg-[#fafcff] p-3 motion-reduce:animate-none">
          <div className="flex justify-between gap-3"><div className="h-4 w-24 rounded bg-[#e8eff7]" /><div className="h-4 w-16 rounded bg-[#e8eff7]" /></div>
          <div className="mt-2 h-3 w-20 rounded bg-[#e8eff7]" /><div className="mt-4 h-6 w-16 rounded bg-[#e8eff7]" />
        </div>
      ))}
    </div>
    <div className="hidden divide-y divide-[#e4eaf8] sm:block">
      <div className="grid grid-cols-4 bg-[#f5f7ff] px-4 py-3 font-medium text-[#545454]"><span>Plan Name</span><span>Date</span><span>Amount</span><span>Status</span>{/* <span>Actions</span> */}</div>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 px-4 py-4">
          {Array.from({ length: 4 }, (_, cell) => <i key={cell} className="h-4 w-20 animate-pulse rounded bg-[#e8eff7] motion-reduce:animate-none" />)}
        </div>
      ))}
    </div>
  </section>
);

const InvoiceHistoryState = ({ title, description, retry }: { title: string; description: string; retry?: () => void }) => (
  <section className="mt-6 overflow-hidden rounded-[8px] border border-[#e4eaf8]">
    <h3 className="border-b border-[#e4eaf8] p-4 text-xl font-bold text-[#0e1224]">Invoice History</h3>
    <div className="flex min-h-48 flex-col items-center justify-center px-5 py-8 text-center">
      <ReceiptText aria-hidden="true" size={32} className="text-[#8ba5c0]" />
      <h4 className="mt-3 font-bold text-[#104170]">{title}</h4>
      <p className="mt-1 max-w-md text-sm text-[#667085]">{description}</p>
      {retry && <button type="button" onClick={retry} className="mt-4 rounded-[7px] bg-[#104170] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2">Try again</button>}
    </div>
  </section>
);

const InvoiceHistory = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const invoicesQuery = useQuery({
    queryKey: ["subscription", "my-invoices", accessToken],
    queryFn: () => getMyInvoices(accessToken!, { page: 1, limit: 10, sortBy: "createdAt" }),
    enabled: status === "authenticated" && Boolean(accessToken),
  });
  const invoices = invoicesQuery.data?.data ?? [];

  if (status === "loading" || invoicesQuery.isLoading) return <InvoiceHistorySkeleton />;
  if (status !== "authenticated" || !accessToken) return <InvoiceHistoryState title="Sign in to view invoices" description="Your membership invoices are available after you sign in." />;
  if (invoicesQuery.isError) return <InvoiceHistoryState title="Invoice history could not be loaded" description="Please check your connection and try again." retry={() => invoicesQuery.refetch()} />;
  if (!invoices.length) return <InvoiceHistoryState title="No invoices found" description="Your membership payment invoices will appear here after a payment is recorded." />;

  return (
    <section className="mt-6 overflow-hidden rounded-[8px] border border-[#e4eaf8] sm:overflow-x-auto">
      <h3 className="border-b border-[#e4eaf8] p-4 text-xl font-bold text-[#0e1224]">Invoice History</h3>
      <div className="space-y-3 p-3 sm:hidden">
        {invoices.map((invoice) => (
          <article key={invoice.id} className="rounded-lg border border-[#e4eaf8] bg-[#fafcff] p-3 text-sm text-[#1b1b3a]">
            <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{invoice.planName}</p><p className="mt-1 text-xs text-[#667085]">{invoice.date}</p></div><b className="text-[#104170]">{formatAmount(invoice.amount, invoice.currency)}</b></div>
            <div className="mt-3 flex items-center gap-3">
              <InvoiceStatus status={invoice.status} />
              {/* <InvoiceAction invoice={invoice} compact /> */}
            </div>
          </article>
        ))}
      </div>
      <div className="hidden min-w-[640px] divide-y divide-[#e4eaf8] text-sm sm:block">
        <div className="grid grid-cols-4 bg-[#f5f7ff] px-4 py-3 font-medium text-[#545454]"><span>Plan Name</span><span>Date</span><span>Amount</span><span>Status</span>{/* <span>Actions</span> */}</div>
        {invoices.map((invoice) => (
          <div key={invoice.id} className="grid grid-cols-4 items-center px-4 py-3 text-[#1b1b3a]"><span className="font-medium">{invoice.planName}</span><span>{invoice.date}</span><span>{formatAmount(invoice.amount, invoice.currency)}</span><span><InvoiceStatus status={invoice.status} /></span>{/* <InvoiceAction invoice={invoice} /> */}</div>
        ))}
      </div>
    </section>
  );
};

export default InvoiceHistory;
