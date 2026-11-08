"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, FileText, ReceiptText, WalletCards } from "lucide-react";
import { useSession } from "next-auth/react";
import { getMyOrderSummary } from "@/lib/order-api";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

const SummaryCardsSkeleton = () => (
  <section aria-label="Loading order summary" className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }, (_, index) => (
      <article key={index} aria-hidden="true" className="flex h-[90px] items-center justify-center gap-5 rounded-[7px] bg-white shadow-[0_2px_10px_rgba(31,61,96,0.04)]">
        <span className="size-12 animate-pulse rounded-full bg-[#edf2f7]" />
        <div>
          <span className="block h-3 w-24 animate-pulse rounded bg-[#edf2f7]" />
          <span className="mt-2 block h-5 w-16 animate-pulse rounded bg-[#e7edf4]" />
        </div>
      </article>
    ))}
  </section>
);

const SummaryCardsError = ({ retry }: { retry: () => void }) => (
  <section role="alert" className="mt-4 rounded-[7px] border border-[#f1c5c5] bg-[#fff7f7] px-5 py-7 text-center">
    <h2 className="text-sm font-bold text-[#8c311e]">Order summary could not be loaded</h2>
    <p className="mt-1 text-xs text-[#5d3830]">Please check your connection and try again.</p>
    <button type="button" onClick={retry} className="mt-4 rounded-[4px] bg-[#087ce7] px-3 py-2 text-xs font-semibold text-white">Try again</button>
  </section>
);

const SummaryCardsNotFound = () => (
  <section className="mt-4 rounded-[7px] border border-dashed border-[#b7c9dc] bg-[#f7fbff] px-5 py-7 text-center">
    <h2 className="text-sm font-bold text-[#104170]">Order summary is unavailable</h2>
    <p className="mt-1 text-xs text-[#38526e]">Your order totals will appear here once they are available.</p>
  </section>
);

const OrderSummaryCards = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const summaryQuery = useQuery({
    queryKey: ["orders", "my-orders", "summary", accessToken],
    queryFn: () => getMyOrderSummary(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 30_000,
  });
  const summary = summaryQuery.data?.data.summaryCards;

  if (status === "loading" || summaryQuery.isLoading) return <SummaryCardsSkeleton />;
  if (summaryQuery.isError) return <SummaryCardsError retry={() => summaryQuery.refetch()} />;
  if (!summary) return <SummaryCardsNotFound />;

  const stats = [
    { label: "Total orders", value: summary.totalOrder.toLocaleString(), icon: ReceiptText, color: "bg-[#e7f2ff] text-[#087ce7]" },
    { label: "Total leads purchased", value: summary.totalPurchasedLeads.toLocaleString(), icon: FileText, color: "bg-[#dff9e9] text-[#00a77a]" },
    { label: "Total spent", value: formatCurrency(summary.totalSpent), icon: CreditCard, color: "bg-[#e7f2ff] text-[#087ce7]" },
    { label: "Wallet balance", value: formatCurrency(summary.walletBalance), icon: WalletCards, color: "bg-[#fff3d9] text-[#c67a00]" },
  ];

  return (
    <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4" aria-live="polite">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <article key={label} className="flex h-[90px] items-center justify-center gap-5 rounded-[7px] bg-white shadow-[0_2px_10px_rgba(31,61,96,0.04)]">
          <span className={`grid size-12 place-items-center rounded-full ${color}`}><Icon size={21} /></span>
          <div>
            <p className="text-[10px] text-[#344054]">{label}</p>
            <p className="mt-1 text-[18px] font-bold text-black">{value}</p>
          </div>
        </article>
      ))}
    </section>
  );
};
export default OrderSummaryCards;
