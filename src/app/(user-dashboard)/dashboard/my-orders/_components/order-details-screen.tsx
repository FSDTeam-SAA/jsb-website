"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  MapPin,
  PackageCheck,
  Wallet,
} from "lucide-react";

import type { Order } from "@/lib/order-api";

type OrderDetailsScreenProps = {
  order: Order;
  onBack: () => void;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const OrderDetailsScreen = ({ order, onBack }: OrderDetailsScreenProps) => {
  const sharedCount = order.items.filter(
    (item) => item.priceType === "SHARED",
  ).length;
  const exclusiveCount = order.items.filter(
    (item) => item.priceType === "EXCLUSIVE",
  ).length;
  const isCompleted = order.status === "COMPLETED";

  return (
    <main className="min-w-0 flex-1 bg-[#f6f9fd] px-4 py-5 md:px-6">
      <section className="mx-auto max-w-[1440px]">
        <button
          type="button"
          onClick={onBack}
          className="group mb-5 flex items-center gap-2 text-sm font-semibold text-[#475467] transition hover:text-[#087ce7]"
        >
          <span className="grid size-8 place-items-center rounded-full border border-[#d0d5dd] bg-white transition group-hover:border-[#087ce7]">
            <ArrowLeft size={16} />
          </span>
          Back to all orders
        </button>

        <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b75d7] via-[#087ce7] to-[#44a6ff] p-5 text-white shadow-[0_12px_28px_rgba(8,124,231,0.18)] md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  Order details
                </span>
                <span
                  className={
                    isCompleted
                      ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#344054]"
                  }
                >
                  {formatStatus(order.status)}
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                {order.orderNumber}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-blue-100">
                <CalendarDays size={16} /> Purchased on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm lg:min-w-[230px]">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-blue-100">
                Total paid
              </p>
              <p className="mt-1 text-3xl font-bold">{formatCurrency(order.totalAmount)}</p>
              <p className="mt-2 text-xs text-blue-100">
                {order.itemsCount} {order.itemsCount === 1 ? "lead" : "leads"} purchased
              </p>
            </div>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Purchased leads",
              value: order.itemsCount,
              icon: PackageCheck,
              iconClass: "bg-blue-100 text-[#087ce7]",
            },
            {
              label: "Shared leads",
              value: sharedCount,
              icon: CheckCircle2,
              iconClass: "bg-violet-100 text-violet-600",
            },
            {
              label: "Exclusive leads",
              value: exclusiveCount,
              icon: CheckCircle2,
              iconClass: "bg-emerald-100 text-emerald-600",
            },
          ].map(({ label, value, icon: Icon, iconClass }) => (
            <article
              key={label}
              className="rounded-xl border border-[#e8eef6] bg-white p-4 shadow-[0_4px_14px_rgba(31,61,96,0.05)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#667085]">{label}</p>
                <span className={`grid size-9 place-items-center rounded-lg ${iconClass}`}>
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-[#17212e]">{value}</p>
            </article>
          ))}
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-xl border border-[#e8eef6] bg-white shadow-[0_4px_14px_rgba(31,61,96,0.05)]">
            <div className="flex flex-col gap-1 border-b border-[#edf1f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-[#17212e]">Purchased leads</h2>
                <p className="mt-1 text-sm text-[#667085]">
                  Leads included in this order.
                </p>
              </div>
              <span className="w-fit rounded-full bg-[#eef7ff] px-3 py-1 text-xs font-semibold text-[#087ce7]">
                {order.items.length} item{order.items.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[#fafcff] text-xs font-medium text-[#667085]">
                  <tr>
                    {[
                      "Lead ID",
                      "Location",
                      "Purchase type",
                      "List price",
                      "Discount",
                      "Paid",
                    ].map((head) => (
                      <th key={head} className="px-5 py-3 font-medium">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t border-[#edf1f5] text-[#344054]">
                      <td className="px-5 py-4 font-semibold">#{item.leadNumber}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2 text-[#475467]">
                          <MapPin size={15} className="shrink-0 text-[#087ce7]" />
                          {item.location}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            item.priceType === "EXCLUSIVE"
                              ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                              : "rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-[#087ce7]"
                          }
                        >
                          {formatStatus(item.priceType)}
                        </span>
                      </td>
                      <td className="px-5 py-4">{formatCurrency(item.originalPrice)}</td>
                      <td className="px-5 py-4 text-emerald-600">
                        {item.discount ? `-${formatCurrency(item.discount)}` : "—"}
                      </td>
                      <td className="px-5 py-4 font-bold text-[#17212e]">
                        {formatCurrency(item.pricePaid)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-[#e8eef6] bg-white p-5 shadow-[0_4px_14px_rgba(31,61,96,0.05)]">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-[#eef7ff] text-[#087ce7]">
                <CreditCard size={20} />
              </span>
              <div>
                <h2 className="font-bold text-[#17212e]">Payment summary</h2>
                <p className="text-xs text-[#667085]">Order {order.orderNumber}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#667085]">Subtotal</dt>
                <dd className="font-medium text-[#344054]">{formatCurrency(order.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#667085]">Discount</dt>
                <dd className="font-medium text-emerald-600">
                  {order.discount ? `-${formatCurrency(order.discount)}` : formatCurrency(0)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-[#667085]">
                  <Wallet size={15} /> Wallet used
                </dt>
                <dd className="font-medium text-[#344054]">{formatCurrency(order.walletUsed)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-[#667085]">
                  <CreditCard size={15} /> Card paid
                </dt>
                <dd className="font-medium text-[#344054]">{formatCurrency(order.cardPaid)}</dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-[#edf1f5] pt-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#17212e]">Total paid</span>
                <span className="text-xl font-bold text-[#087ce7]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>

            {order.receiptUrl ? (
              <a
                href={order.receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex h-10 items-center justify-center gap-2 rounded-lg bg-[#087ce7] px-3 text-sm font-semibold text-white transition hover:bg-[#076cc8]"
              >
                <Download size={16} /> Download receipt
              </a>
            ) : (
              <p className="mt-5 rounded-lg bg-[#f8fafc] px-3 py-2.5 text-center text-xs text-[#667085]">
                Receipt is not available for this order yet.
              </p>
            )}

            {order.stripePaymentId && (
              <p className="mt-4 border-t border-[#edf1f5] pt-4 text-xs text-[#98a2b3]">
                Transaction ID:{" "}
                <span className="break-all text-[#667085]">{order.stripePaymentId}</span>
              </p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
};

export default OrderDetailsScreen;
