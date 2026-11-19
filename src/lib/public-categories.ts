import { queryOptions } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export type PublicCategory = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export const categoryHref = (id: string) =>
  `/lead-types/${encodeURIComponent(id)}`;

async function getPublicCategories(signal?: AbortSignal) {
  const categories: PublicCategory[] = [];
  let page = 1;

  while (true) {
    const { data, meta } = await apiRequest<PublicCategory[]>(
      `/categories?page=${page}`,
      { signal },
    );
    categories.push(...data);

    if (
      !data.length ||
      typeof meta?.total !== "number" ||
      categories.length >= meta.total
    ) {
      return categories.filter((category) => category.isActive);
    }

    page += 1;
  }
}

export const publicCategoriesQueryOptions = queryOptions({
  queryKey: ["public-categories"],
  queryFn: ({ signal }) => getPublicCategories(signal),
  staleTime: 5 * 60 * 1000,
});
