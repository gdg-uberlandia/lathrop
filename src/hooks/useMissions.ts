import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import {
  createMissionAPI,
  deleteMissionAPI,
  getMissionsAPI,
  readMissionAPI,
  updateMissionAPI,
} from "@/front-features/missions";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { Mission, MissionInput } from "@/models/mission";

export function useMissions() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const missionsQuery = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.missions,
    queryFn: ({ signal }) => getMissionsAPI(signal),
  });

  const createMutation = useMutation({
    mutationFn: createMissionAPI,
    onSuccess: (mission) => {
      queryClient.setQueryData<Mission[]>(adminQueryKeys.missions, (current) =>
        [...(current ?? []), mission].sort((a, b) => a.order - b.order),
      );
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateMissionAPI,
    onSuccess: (mission) => {
      queryClient.setQueryData<Mission[]>(adminQueryKeys.missions, (current) =>
        current?.map((item) => (item.id === mission.id ? mission : item)),
      );
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteMissionAPI,
    onSuccess: (missionId) => {
      queryClient.setQueryData<Mission[]>(adminQueryKeys.missions, (current) =>
        current?.filter((item) => item.id !== missionId),
      );
    },
  });

  const fetchMission = (missionId: string) =>
    resolveAdminAction(() =>
      queryClient.fetchQuery({
        queryKey: [...adminQueryKeys.missions, missionId],
        queryFn: ({ signal }) => readMissionAPI({ missionId, signal }),
      }),
    );

  const error =
    missionsQuery.error ||
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error;

  return {
    missions: missionsQuery.data ?? [],
    loading:
      missionsQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar missões")
      : null,
    fetchMissions: missionsQuery.refetch,
    fetchMission,
    addMission: (mission: MissionInput) =>
      resolveAdminAction(() => createMutation.mutateAsync(mission)),
    removeMission: (missionId: string) =>
      resolveAdminAction(() => deleteMutation.mutateAsync(missionId)),
    updateMission: (mission: MissionInput) =>
      resolveAdminAction(() => updateMutation.mutateAsync(mission)),
  };
}
