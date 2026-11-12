"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, SearchCheck, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";

import { getMyOrders } from "@/lib/order-api";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const RecentOrdersCard = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const ordersQuery = useQuery({
    queryKey: ["orders", "recent", accessToken],
    queryFn: () => getMyOrders(accessToken!, { page: 1, limit: 3 }),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 60_000,
  });
  const orders = ordersQuery.data?.data ?? [];

  return (
    <article className="overflow-hidden rounded-2xl border border-[#ebf4ff] bg-white">
      <CardHeader />
      <div className="px-3">
        {status === "loading" || ordersQuery.isLoading ? (
          <RecentOrdersSkeleton />
        ) : status !== "authenticated" || !accessToken ? (
          <CardMessage message="Sign in to view your orders." />
        ) : ordersQuery.isError ? (
          <CardMessage
            message="Orders could not be loaded."
            actionLabel="Try again"
            onAction={() => ordersQuery.refetch()}
          />
        ) : orders.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-4 border-b border-[#eaeaea] py-4 text-xs text-[#878a9b] last:border-0"
            >
              <span className="truncate font-medium text-[#141936]">
                {order.orderNumber}
              </span>
              <span className="text-center">
                {order.itemsCount} {order.itemsCount === 1 ? "lead" : "leads"}
              </span>
              <span className="text-center">{formatDate(order.createdAt)}</span>
              <span className="text-right font-semibold text-[#141936]">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

const CardHeader = () => (
  <div className="flex h-[52px] items-center justify-between border-b-2 border-[#f1f4f9] px-3">
    <div className="flex items-center gap-1">
      <SearchCheck size={24} className="text-[#087ce7]" />
      <h2 className="text-sm font-bold text-black">Recent Orders</h2>
    </div>
    <Link href="/dashboard/my-orders" className="text-xs font-semibold text-[#1779fe]">
      View All
    </Link>
  </div>
);

const EmptyOrdersState = () => (
  <div className="flex flex-col items-center px-4 py-9 text-center">
    <span className="grid size-11 place-items-center rounded-full bg-[#edf7ff] text-[#087ce7]">
      <ShoppingBag aria-hidden="true" size={21} />
    </span>
    <h3 className="mt-3 text-sm font-bold text-[#141936]">No orders yet</h3>
    <p className="mt-1 max-w-[260px] text-xs leading-5 text-[#667085]">
      Your recent lead purchases will appear here.
    </p>
    <Link
      href="/dashboard/find-leads"
      className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#087ce7] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#066bc4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] focus-visible:ring-offset-2"
    >
      Browse leads
      <ArrowRight aria-hidden="true" size={14} />
    </Link>
  </div>
);

const RecentOrdersSkeleton = () => (
  <div className="space-y-3 py-3" aria-label="Loading recent orders">
    {[1, 2, 3].map((row) => (
      <div key={row} className="grid grid-cols-4 gap-3 border-b border-[#eaeaea] pb-3 last:border-0">
        {[1, 2, 3, 4].map((cell) => (
          <span key={cell} className="h-3 animate-pulse rounded bg-[#edf2f7]" />
        ))}
      </div>
    ))}
  </div>
);

const CardMessage = ({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="py-8 text-center">
    <p className="text-xs text-[#667085]">{message}</p>
    {actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="mt-2 text-xs font-semibold text-[#087ce7] hover:underline"
      >
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default RecentOrdersCard;
