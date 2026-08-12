import { adminApiRequest } from "@/lib/admin-api/client";
import { Sponsor, SponsorLevel } from "@/models/sponsor";

const SPONSORS_API_PATH = "/api/v1/sponsors";

export const getSponsorsAPI = (signal?: AbortSignal) =>
  adminApiRequest<SponsorLevel[]>(SPONSORS_API_PATH, { signal });

export const createSponsorAPI = (sponsor: Sponsor) =>
  adminApiRequest<Sponsor>(SPONSORS_API_PATH, {
    method: "POST",
    body: sponsor,
  });

export const readSponsorAPI = ({
  sponsorId,
  sponsorLevel,
  signal,
}: {
  sponsorId: string;
  sponsorLevel: string;
  signal?: AbortSignal;
}) =>
  adminApiRequest<Sponsor>(`${SPONSORS_API_PATH}/${sponsorId}`, {
    query: { sponsorLevel },
    signal,
  });

export const updateSponsorAPI = (sponsor: Sponsor) =>
  adminApiRequest<Sponsor>(`${SPONSORS_API_PATH}/${sponsor.id}`, {
    method: "PUT",
    body: sponsor,
  });

export const deleteSponsorAPI = async (sponsorId: string) => {
  const result = await adminApiRequest<{ id: string }>(
    `${SPONSORS_API_PATH}/${sponsorId}`,
    { method: "DELETE" },
  );
  return result.id;
};
