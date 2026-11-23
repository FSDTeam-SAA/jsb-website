import { notFound } from "next/navigation";
import { ApiRequestError, apiRequest } from "@/lib/api";
import type { PublicCategory } from "@/lib/public-categories";
import ReadyToStart from "../../_components/ready-to-start";
import LeadTypesContainer from "../_components/lead-types-containers";

async function getCategory(id: string) {
  try {
    const { data } = await apiRequest<PublicCategory>(
      `/categories/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
    return data.isActive ? data : null;
  } catch (error) {
    if (error instanceof ApiRequestError && error.statusCode === 404) return null;
    throw error;
  }
}

export default async function LeadTypePage({
  params,
}: {
  params: { categoryId: string };
}) {
  const category = await getCategory(params.categoryId);
  if (!category) notFound();

  return (
    <div>
      <LeadTypesContainer category={category} />
      <ReadyToStart />
    </div>
  );
}
