"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { getMyOrders, type Order } from "@/lib/order-api";

const pageSizes = [10, 25, 50];
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const OrdersTable = ({
  onViewDetails,
}: {
  onViewDetails: (order: Order) => void;
}) => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSizes[0]);
  const ordersQuery = useQuery({
    queryKey: ["orders", "my-orders", accessToken, page, limit],
    queryFn: () => getMyOrders(accessToken!, { page, limit }),
    enabled: status === "authenticated" && Boolean(accessToken),
  });
  const orders = ordersQuery.data?.data ?? [];
  const meta = ordersQuery.data?.meta;
  const results = orders.filter((order) =>
    [
      order.orderNumber,
      order.status,
      ...order.items.map((item) => item.location),
    ]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const firstResult = meta?.total ? (page - 1) * limit + 1 : 0;
  const lastResult = meta?.total ? Math.min(page * limit, meta.total) : 0;

  const setPageSize = (pageSize: number) => {
    setLimit(pageSize);
    setPage(1);
  };

  return (
    <section className="mt-4 rounded-[7px] bg-white p-3 shadow-[0_2px_10px_rgba(31,61,96,0.04)]">
      <div className="relative max-w-[260px]">
        <Search className="absolute left-2 top-2 text-[#98a2b3]" size={13} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by order id ..."
          className="h-8 w-full rounded-[4px] border border-[#d0d5dd] pl-7 pr-2 text-[9px]"
        />
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-[9px]">
          <thead className="bg-[#fafcff] text-[#667085]">
            <tr>
              {[
                "Order Id",
                "Purchased Date",
                "Total Leads",
                "Shared",
                "Exclusive",
                "Discount",
                "Total Price",
                "Status",
                "Action",
              ].map((head) => (
                <th key={head} className="px-2 py-3 font-medium">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordersQuery.isLoading || status === "loading" ? (
              <tr>
                <td colSpan={9} className="px-2 py-8 text-center text-[#667085]">
                  Loading orders...
                </td>
              </tr>
            ) : ordersQuery.isError ? (
              <tr>
                <td colSpan={9} className="px-2 py-8 text-center text-[#d92d20]">
                  Unable to load orders. Please try again.
                </td>
              </tr>
            ) : status !== "authenticated" || !accessToken ? (
              <tr>
                <td colSpan={9} className="px-2 py-8 text-center text-[#667085]">
                  Please sign in to view your orders.
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-2 py-8 text-center text-[#667085]">
                  No orders found.
                </td>
              </tr>
            ) : (
              results.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#edf1f5] text-[#344054]"
                >
                  <td className="px-2 py-2.5">{order.orderNumber}</td>
                  <td className="px-2 py-2.5">{formatDate(order.createdAt)}</td>
                  <td className="px-2 py-2.5">{order.itemsCount}</td>
                  <td className="px-2 py-2.5">
                    {order.items.filter((item) => item.priceType === "SHARED").length}
                  </td>
                  <td className="px-2 py-2.5">
                    {order.items.filter((item) => item.priceType === "EXCLUSIVE").length}
                  </td>
                  <td className="px-2 py-2.5 text-[#00a77a]">
                    {formatCurrency(order.discount)}
                  </td>
                  <td className="px-2 py-2.5">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-2 py-2.5">
                    <span className="rounded bg-[#ddf9e8] px-1.5 py-1 text-[#10a44c]">
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <button
                      type="button"
                      onClick={() => onViewDetails(order)}
                      className="rounded border border-[#8dc7ff] px-1.5 py-1 text-[#087ce7]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex justify-between text-[9px] text-[#98a2b3]">
        <span>
          Showing {firstResult}-{lastResult} of {meta?.total ?? 0}
        </span>
        <div className="flex gap-2">
          {pageSizes.map((pageSize) => (
            <button
              key={pageSize}
              type="button"
              onClick={() => setPageSize(pageSize)}
              className={
                limit === pageSize
                  ? "rounded border border-[#8dc7ff] px-2 py-1 text-[#087ce7]"
                  : "px-2 py-1"
              }
            >
              {pageSize}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            disabled={page === 1}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={!meta || page >= meta.totalPage}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
export default OrdersTable;
