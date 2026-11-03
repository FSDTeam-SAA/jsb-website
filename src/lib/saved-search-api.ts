import { apiRequest, jsonRequest, type ApiEnvelope } from "@/lib/api";
import type { MarketplaceFilters, MarketplaceLead } from "@/lib/marketplace-api";

export type SavedSearch = {
  id: string;
  title: string;
  filters: MarketplaceFilters;
  createdAt: string;
  updatedAt: string;
};

export type SavedSearchResultsResponse = ApiEnvelope<MarketplaceLead[]>;

export const createSavedSearch = (
  accessToken: string,
  input: { title: string; filters: MarketplaceFilters },
) => jsonRequest<SavedSearch>("/saved-search", "POST", input, accessToken);

export const getSavedSearches = (accessToken: string) =>
  apiRequest<SavedSearch[]>("/saved-search", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const getSavedSearchResults = (accessToken: string, id: string) =>
  apiRequest<MarketplaceLead[]>(`/saved-search/${encodeURIComponent(id)}/results`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const deleteSavedSearch = (accessToken: string, id: string) =>
  apiRequest<undefined>(`/saved-search/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
