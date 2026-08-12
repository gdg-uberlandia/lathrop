import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  createRaffleAPI,
  deleteRaffleAPI,
  getRafflesAPI,
  readRaffleAPI,
  updateRaffleAPI,
} from "@/front-features/raffles";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import type { Raffle, RaffleInput } from "@/contracts/raffle";
import { useCallback } from "react";

export function useRaffles() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const query = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.raffles,
    queryFn: ({ signal }) => getRafflesAPI(signal),
  });
  const updateCache = (raffle: Raffle) =>
    client.setQueryData<Raffle[]>(adminQueryKeys.raffles, (items) =>
      [...(items ?? []).filter((item) => item.id !== raffle.id), raffle].sort(
        (a, b) => a.order - b.order,
      ),
    );
  const create = useMutation({
    mutationFn: createRaffleAPI,
    onSuccess: updateCache,
  });
  const update = useMutation({
    mutationFn: updateRaffleAPI,
    onSuccess: updateCache,
  });
  const remove = useMutation({
    mutationFn: deleteRaffleAPI,
    onSuccess: (id) =>
      client.setQueryData<Raffle[]>(adminQueryKeys.raffles, (items) =>
        items?.filter((item) => item.id !== id),
      ),
  });
  const error = query.error || create.error || update.error || remove.error;
  const fetchRaffle = useCallback(
    (id: string) =>
      resolveAdminAction(() =>
        client.fetchQuery({
          queryKey: [...adminQueryKeys.raffles, id],
          queryFn: ({ signal }) => readRaffleAPI(id, signal),
        }),
      ),
    [client],
  );
  return {
    raffles: query.data ?? [],
    loading:
      query.isFetching ||
      create.isPending ||
      update.isPending ||
      remove.isPending,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar prêmios")
      : null,
    fetchRaffles: query.refetch,
    fetchRaffle,
    addRaffle: (value: RaffleInput) =>
      resolveAdminAction(() => create.mutateAsync(value)),
    updateRaffle: (value: RaffleInput) =>
      resolveAdminAction(() => update.mutateAsync(value)),
    removeRaffle: (id: string) =>
      resolveAdminAction(() => remove.mutateAsync(id)),
  };
}
