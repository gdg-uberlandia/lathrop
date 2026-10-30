import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  createRewardAPI,
  getRewardsAPI,
  readRewardAPI,
  updateRewardAPI,
} from "@/front-features/rewards";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import type { Reward, RewardInput, RewardUpdate } from "@/contracts/reward";
import { useCallback } from "react";

export function useRewards() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const query = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.rewards,
    queryFn: ({ signal }) => getRewardsAPI(signal),
  });
  const updateCache = (reward: Reward) => {
    client.setQueryData([...adminQueryKeys.rewards, reward.id], reward);
    client.setQueryData<Reward[]>(adminQueryKeys.rewards, (items) =>
      [...(items ?? []).filter((item) => item.id !== reward.id), reward].sort(
        (a, b) => a.order - b.order,
      ),
    );
  };
  const create = useMutation({
    mutationFn: createRewardAPI,
    onSuccess: updateCache,
  });
  const update = useMutation({
    mutationFn: updateRewardAPI,
    onSuccess: updateCache,
  });
  const error = query.error || create.error || update.error;
  const fetchReward = useCallback(
    (id: string) =>
      resolveAdminAction(() =>
        client.fetchQuery({
          queryKey: [...adminQueryKeys.rewards, id],
          staleTime: 0,
          queryFn: ({ signal }) => readRewardAPI(id, signal),
        }),
      ),
    [client],
  );
  return {
    rewards: query.data ?? [],
    loading: query.isFetching || create.isPending || update.isPending,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar brindes")
      : null,
    fetchRewards: query.refetch,
    fetchReward,
    addReward: (value: RewardInput) =>
      resolveAdminAction(() => create.mutateAsync(value)),
    updateReward: (value: RewardUpdate) =>
      resolveAdminAction(() => update.mutateAsync(value)),
  };
}
