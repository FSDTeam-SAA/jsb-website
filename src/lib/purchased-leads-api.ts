import { apiRequest, jsonRequest, type ApiEnvelope } from "@/lib/api";

export type PurchasedLeadDetails = {
  id: string;
  leadNumber: number;
  category: {
    id: string;
    name: string;
  };
  firstName: string | null;
  lastName: string | null;
  propertyAddress: string | null;
  unitNumber: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  zipcode: string | null;
  propertyType: string | null;
  propertyImage: string | null;
  estValue: number | null;
  estEquity: number | null;
  mortgageBalance: number | null;
  saleDate: string | null;
  stage: string | null;
  mortgageInformation: string | null;
  phoneNumbers: string[];
  emailAddresses: string[];
  source: string | null;
};

export type PurchasedLead = {
  id: string;
  leadId: string;
  priceType: "SHARED" | "EXCLUSIVE" | string;
  pricePaid: number;
  purchasedAt: string;
  orderId: string;
  lead: PurchasedLeadDetails;
};

export type PurchasedLeadsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export const badLeadReasons = [
  "INVALID_PHONE",
  "INVALID_EMAIL",
  "INCORRECT_CONTACT",
  "INCORRECT_PROPERTY",
  "DUPLICATE_PURCHASE",
  "OUTDATED_DATA",
  "OTHER",
] as const;

export type BadLeadReason = (typeof badLeadReasons)[number];

export type SubmitBadLeadRequestInput = {
  leadId: string;
  reason: BadLeadReason;
  explanation?: string;
};

export type BadLeadRequest = {
  id: string;
  userId: string;
  leadId: string;
  reason: BadLeadReason;
  explanation: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  creditReturned: number | null;
  adminNotes: string | null;
  reviewedAt: string | null;
  reviewedById: string | null;
  createdAt: string;
  updatedAt: string;
  lead: {
    id: string;
    leadNumber: number;
    city: string | null;
    state: string | null;
  };
};

export type MyPurchasedLeadsResponse = Omit<ApiEnvelope<PurchasedLead[]>, "meta"> & {
  meta?: PurchasedLeadsMeta;
};

export const getMyPurchasedLeads = async (
  accessToken: string,
  { page = 1, limit = 10 }: Partial<Pick<PurchasedLeadsMeta, "page" | "limit">> = {},
): Promise<MyPurchasedLeadsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiRequest<PurchasedLead[]>(`/order/my-leads?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }) as Promise<MyPurchasedLeadsResponse>;
};

export const submitBadLeadRequest = (
  accessToken: string,
  input: SubmitBadLeadRequestInput,
) =>
  jsonRequest<BadLeadRequest>(
    "/order/bad-lead-request",
    "POST",
    input,
    accessToken,
  );
