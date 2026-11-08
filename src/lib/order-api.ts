import { apiRequest, type ApiEnvelope } from "@/lib/api";

export type OrderItem = {
  id: string;
  leadId: string;
  leadNumber: number;
  location: string;
  priceType: "SHARED" | "EXCLUSIVE" | string;
  originalPrice: number;
  discount: number;
  pricePaid: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  walletUsed: number;
  cardPaid: number;
  status: string;
  stripePaymentId: string | null;
  receiptUrl: string | null;
  itemsCount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type OrdersMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type MyOrdersResponse = Omit<ApiEnvelope<Order[]>, "meta"> & {
  meta?: OrdersMeta;
};

export type MyOrderSummary = {
  summaryCards: {
    totalOrder: number;
    totalPurchasedLeads: number;
    totalSpent: number;
    walletBalance: number;
  };
  financialBreakdown: {
    totalSpent: number;
    walletSpent: number;
    cardSpent: number;
    promoSavings: number;
    currency: string;
  };
  orderStats: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
  };
  recentOrders: Array<Pick<Order, "id" | "orderNumber" | "totalAmount" | "walletUsed" | "cardPaid" | "status" | "itemsCount" | "createdAt">>;
};

export const getMyOrders = async (
  accessToken: string,
  { page = 1, limit = 10 }: Partial<Pick<OrdersMeta, "page" | "limit">> = {},
): Promise<MyOrdersResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiRequest<Order[]>(`/order/my-orders?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }) as Promise<MyOrdersResponse>;
};

export const getMyOrderSummary = (accessToken: string) =>
  apiRequest<MyOrderSummary>("/order/my-orders/summary", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
