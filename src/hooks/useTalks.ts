import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Talk, TalkInput } from "@/contracts/talk";
import { useAuth } from "@/context/AuthContext";
import {
  createTalkAPI,
  deleteTalkAPI,
  getTalksAPI,
  readTalkAPI,
  updateTalkAPI,
} from "@/front-features/talks";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";

export function useTalks() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const talksQuery = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.talks,
    queryFn: ({ signal }) => getTalksAPI(signal),
  });
  const createMutation = useMutation({
    mutationFn: createTalkAPI,
    onSuccess: (talk) =>
      queryClient.setQueryData<Talk[]>(adminQueryKeys.talks, (current) =>
        [...(current ?? []), talk].sort((a, b) =>
          a.title.localeCompare(b.title, "pt-BR"),
        ),
      ),
  });
  const updateMutation = useMutation({
    mutationFn: updateTalkAPI,
    onSuccess: (talk) =>
      queryClient.setQueryData<Talk[]>(adminQueryKeys.talks, (current) =>
        current?.map((item) => (item.id === talk.id ? talk : item)),
      ),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTalkAPI,
    onSuccess: (talkId) =>
      queryClient.setQueryData<Talk[]>(adminQueryKeys.talks, (current) =>
        current?.filter((item) => item.id !== talkId),
      ),
  });

  const error =
    talksQuery.error ||
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error;

  return {
    talks: talksQuery.data ?? [],
    loading:
      talksQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar palestras")
      : null,
    fetchTalks: talksQuery.refetch,
    fetchTalk: (talkId: string) =>
      resolveAdminAction(() =>
        queryClient.fetchQuery({
          queryKey: [...adminQueryKeys.talks, talkId],
          queryFn: ({ signal }) => readTalkAPI(talkId, signal),
        }),
      ),
    addTalk: (talk: TalkInput) =>
      resolveAdminAction(() => createMutation.mutateAsync(talk)),
    updateTalk: (talk: TalkInput) =>
      resolveAdminAction(() => updateMutation.mutateAsync(talk)),
    removeTalk: (talkId: string) =>
      resolveAdminAction(() => deleteMutation.mutateAsync(talkId)),
  };
}
