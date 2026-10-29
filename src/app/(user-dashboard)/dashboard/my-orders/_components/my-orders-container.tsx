"use client";
import { useState } from "react";
import OrderDetails from "./order-details";
import OrdersTable from "./orders-table";
import OrderSummaryCards from "./order-summary-cards";

const MyOrdersContainers = () => { const [detailsOpen, setDetailsOpen] = useState(false); return <main className="min-w-0 flex-1 bg-[#f6f9fd] px-4 py-5 md:px-6"><section className="mx-auto max-w-[1640px]"><h1 className="text-[18px] font-bold text-[#17212e]">My Orders</h1><p className="mt-1 text-[12px] text-[#667085]">Review orders, access receipts, and re-download lead files.</p><OrderSummaryCards /><OrdersTable onViewDetails={() => setDetailsOpen(true)} /></section><OrderDetails open={detailsOpen} onClose={() => setDetailsOpen(false)} /></main>; };
export default MyOrdersContainers;
