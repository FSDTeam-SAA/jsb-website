"use client";
import { useState } from "react";

import type { Order } from "@/lib/order-api";

import OrderDetailsScreen from "./order-details-screen";
import OrdersTable from "./orders-table";
import OrderSummaryCards from "./order-summary-cards";

const MyOrdersContainers = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  if (selectedOrder)
    return <OrderDetailsScreen order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  return (
    <main className="min-w-0 flex-1 bg-[#f6f9fd] px-4 py-5 md:px-6">
      <section className="mx-auto max-w-[1640px]">
        <h1 className="text-xl font-bold text-[#17212e]">My Orders</h1>
        <p className="mt-1 text-[12px] text-[#667085]">
          Review orders, access receipts, and re-download lead files.
        </p>
        <OrderSummaryCards />
        <OrdersTable onViewDetails={setSelectedOrder} />
      </section>
    </main>
  );
};
export default MyOrdersContainers;
