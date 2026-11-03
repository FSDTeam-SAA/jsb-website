import { apiRequest, jsonRequest } from "@/lib/api";

export type AddToCartInput = {
  leadId: string;
  priceType: "SHARED" | "EXCLUSIVE";
};

export const addToCart = (accessToken: string, input: AddToCartInput) =>
  jsonRequest("/cart/items", "POST", input, accessToken);

export type AddMultipleToCartInput = {
  cartData: AddToCartInput[];
};

export const addMultipleToCart = (
  accessToken: string,
  input: AddMultipleToCartInput,
) => jsonRequest("/cart/multiple", "POST", input, accessToken);

export type BulkAddToCartInput = {
  quantity: number;
  priceType: "SHARED" | "EXCLUSIVE";
  categoryId?: string;
  state?: string;
  city?: string;
};

export type BulkAddToCartResult = {
  addedCount: number;
  requestedQuantity: number;
};

export const bulkAddToCart = (accessToken: string, input: BulkAddToCartInput) =>
  jsonRequest<BulkAddToCartResult>("/cart/bulk", "POST", input, accessToken);

export type CartSummary = {
  totalItems: number;
  unavailableItems: number;
  subtotal: number | string;
  discount: number | string;
  total: number | string;
  walletBalance: number | string;
  currency: string;
  appliedDiscountPercent: number;
  hasActiveSubscription: boolean;
  subscriptionName: string | null;
};

export type CartResponse = {
  summary: CartSummary;
  items: unknown[];
};

export const getCart = (accessToken: string) =>
  apiRequest<CartResponse>("/cart", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
