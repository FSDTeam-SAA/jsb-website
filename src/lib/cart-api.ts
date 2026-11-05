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

export type CartItem = {
  cartItemId: string;
  leadId: string;
  leadNumber: number;
  location: string;
  propertyType: string | null;
  stage: string | null;
  categoryName: string;
  priceType: "SHARED" | "EXCLUSIVE" | string;
  originalPrice: number | string;
  discount: number | string;
  finalPrice: number | string;
  available: boolean;
  currency: string;
  addedAt: string;
};

export type CartResponse = {
  summary: CartSummary;
  items: CartItem[];
};

export type CheckoutCartInput = {
  cartItemIds: string[];
  useWallet: boolean;
  promoCode?: string;
};

export type CheckoutResult = {
  message: string;
  orderId: string;
  orderNumber: string;
  checkoutUrl: string | null;
  totalAmount: number;
  walletUsed: number;
  cardPaid: number;
  itemsCount: number;
};

export type ValidatePromoCodeInput = {
  code: string;
  subtotal: number;
};

export type ValidatePromoCodeResult = {
  valid: true;
  promoCodeId: string;
  code: string;
  discount: number;
  discountAmount: number;
  subtotal: number;
  finalAmount: number;
  message: string;
};

export const getCart = (accessToken: string) =>
  apiRequest<CartResponse>("/cart", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const checkoutCart = (accessToken: string, input: CheckoutCartInput) =>
  jsonRequest<CheckoutResult>("/order/checkout", "POST", input, accessToken);

export const validatePromoCode = (
  accessToken: string,
  input: ValidatePromoCodeInput,
) =>
  jsonRequest<ValidatePromoCodeResult>(
    "/promo-code/validate",
    "POST",
    input,
    accessToken,
  );
