import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSponsorAPI,
  deleteSponsorAPI,
  getSponsorsAPI,
  readSponsorAPI,
  updateSponsorAPI,
} from "@/front-features/sponsors";
import { useAuth } from "@/context/AuthContext";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";
import { Sponsor, SponsorLevel } from "@/models/sponsor";

function calculateSponsorship(sponsors: SponsorLevel[]) {
  const levelValues: Record<string, number> = {
    diamond: 40,
    gold: 30,
    silver: 20,
    bronze: 10,
    iron: 8,
    ruby: 5,
  };

  return sponsors.reduce(
    (total, level) =>
      total +
      level.items.reduce(
        (subtotal, sponsor) => subtotal + (levelValues[sponsor.level] ?? 0),
        0,
      ),
    0,
  );
}

export function useSponsors() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const sponsorsQuery = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.sponsors,
    queryFn: ({ signal }) => getSponsorsAPI(signal),
  });

  const refreshAfterMutation = () =>
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.sponsors });
  const createMutation = useMutation({
    mutationFn: createSponsorAPI,
    onSuccess: refreshAfterMutation,
  });
  const updateMutation = useMutation({
    mutationFn: updateSponsorAPI,
    onSuccess: refreshAfterMutation,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteSponsorAPI,
    onSuccess: refreshAfterMutation,
  });

  const sponsors = sponsorsQuery.data ?? [];
  const error =
    sponsorsQuery.error ||
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error;

  return {
    sponsors,
    sponsorship: calculateSponsorship(sponsors),
    loading:
      sponsorsQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar patrocinadores")
      : null,
    fetchSponsors: sponsorsQuery.refetch,
    fetchSponsor: ({
      sponsorId,
      sponsorLevel,
    }: {
      sponsorId: string;
      sponsorLevel: string;
    }) =>
      resolveAdminAction(() =>
        queryClient.fetchQuery({
          queryKey: [...adminQueryKeys.sponsors, sponsorId],
          queryFn: ({ signal }) =>
            readSponsorAPI({ sponsorId, sponsorLevel, signal }),
        }),
      ),
    addSponsor: (sponsor: Sponsor) =>
      resolveAdminAction(() => createMutation.mutateAsync(sponsor)),
    updateSponsor: (sponsor: Sponsor) =>
      resolveAdminAction(() => updateMutation.mutateAsync(sponsor)),
    removeSponsor: (sponsorId: string) =>
      resolveAdminAction(() => deleteMutation.mutateAsync(sponsorId)),
  };
}
