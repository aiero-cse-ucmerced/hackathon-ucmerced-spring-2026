import type { InternshipKind, MatchedListing } from "@/app/api/internships/route";

export interface FetchInternshipsParams {
  type?: InternshipKind;
  interests?: string[];
  major?: string;
  location?: string;
  minScore?: number;
  page?: number;
}

export interface FetchInternshipsResponse {
  items: MatchedListing[];
  kind: InternshipKind;
}

export async function fetchInternships(
  params: FetchInternshipsParams = {},
): Promise<FetchInternshipsResponse> {
  const search = new URLSearchParams();

  if (params.type) search.set("type", params.type);
  if (params.interests && params.interests.length > 0) {
    search.set("interests", params.interests.join(","));
  }
  if (params.major) search.set("major", params.major);
  if (params.location) search.set("location", params.location);
  if (typeof params.minScore === "number") {
    search.set("minScore", String(params.minScore));
  }
  if (typeof params.page === "number") {
    search.set("page", String(params.page));
  }

  const query = search.toString();
  const url = query ? `/api/internships?${query}` : "/api/internships";

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.warn(
      "[UncookedAura] Internships API error",
      res.status,
      await res.text(),
    );
    return { items: [], kind: params.type ?? "internship" };
  }

  const json = (await res.json()) as FetchInternshipsResponse;
  return {
    items: Array.isArray(json.items) ? json.items : [],
    kind: json.kind ?? (params.type ?? "internship"),
  };
}

