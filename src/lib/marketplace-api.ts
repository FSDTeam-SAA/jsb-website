import { apiRequest } from "@/lib/api";

export type MarketplaceLead = {
  id: string;
  leadNumber: number;
  city: string | null;
  state: string | null;
  county: string | null;
  zipcode: string | null;
  propertyType: string | null;
  propertyImage: string | null;
  estValue: number | null;
  estEquity: number | null;
  mortgageBalance: number | null;
  saleDate: string | null;
  stage: string | null;
  availability: "SHARED" | "EXCLUSIVE" | "BOTH";
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
  sharedPrice: number | null;
  exclusivePrice: number | null;
  currency: string;
  appliedDiscountPercent: number;
  appliedAgeDiscountPercent: number;
};

export type MarketplaceMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type MarketplaceFilters = {
  searchTerm?: string;
  categoryId?: string[];
  city?: string;
  state?: string;
  county?: string;
  zipcode?: string;
  propertyType?: string;
  availability?: Array<MarketplaceLead["availability"]>;
  freshness?: "today" | "last7Days" | "last30Days" | "custom";
  createdFrom?: string;
  createdTo?: string;
  minEstValue?: string;
  maxEstValue?: string;
  minEstEquity?: string;
  maxEstEquity?: string;
  minMortgageBalance?: string;
  maxMortgageBalance?: string;
  contactData?: "phone" | "email" | "both";
  minPrice?: string;
  maxPrice?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "estValue" | "estEquity" | "mortgageBalance" | "saleDate";
  sortOrder?: "asc" | "desc";
};

const marketplacePath = (filters: MarketplaceFilters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(","));
    } else if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return `/marketplace${query ? `?${query}` : ""}`;
};

export const getMarketplaceLeads = (
  accessToken: string,
  filters?: MarketplaceFilters,
) =>
  apiRequest<MarketplaceLead[]>(marketplacePath(filters), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
