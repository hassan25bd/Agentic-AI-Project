import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { ExperienceListResponse, ExperienceDetailResponse } from "@/lib/types";

export interface ExploreFilters {
  search?: string;
  category?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: ExploreFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useExperiences(filters: ExploreFilters) {
  return useQuery({
    queryKey: ["experiences", filters],
    queryFn: () =>
      apiFetch<ExperienceListResponse>(`/experiences${buildQuery(filters)}`, { auth: false }),
    placeholderData: (prev) => prev,
  });
}

export function useExperience(id: string | undefined) {
  return useQuery({
    queryKey: ["experience", id],
    queryFn: () => apiFetch<ExperienceDetailResponse>(`/experiences/${id}`, { auth: false }),
    enabled: Boolean(id),
  });
}

export function useFeaturedExperiences() {
  return useQuery({
    queryKey: ["experiences", "featured"],
    queryFn: () =>
      apiFetch<ExperienceListResponse>("/experiences?sort=rating_desc&limit=8", { auth: false }),
  });
}
