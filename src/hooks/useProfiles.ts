import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import { getProfilesAPI } from "@/front-features/profiles";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { adminQueryKeys } from "@/lib/admin-query";

export const useProfiles = () => {
  const { isAdmin } = useAuth();
  const profilesQuery = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.profiles,
    queryFn: ({ signal }) => getProfilesAPI(signal),
  });

  return {
    profiles: profilesQuery.data ?? [],
    loading: profilesQuery.isFetching,
    error: profilesQuery.error
      ? getAdminApiErrorMessage(
          profilesQuery.error,
          "Erro ao buscar participantes",
        )
      : null,
    refetch: profilesQuery.refetch,
  };
};
