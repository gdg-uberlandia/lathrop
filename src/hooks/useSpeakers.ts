import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Speaker, SpeakerInput } from "@/contracts/speaker";
import { useAuth } from "@/context/AuthContext";
import {
  createSpeakerAPI,
  deleteSpeakerAPI,
  getSpeakersAPI,
  readSpeakerAPI,
  updateSpeakerAPI,
} from "@/front-features/speakers";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";

export function useSpeakers() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const speakersQuery = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.speakers,
    queryFn: ({ signal }) => getSpeakersAPI(signal),
  });
  const createMutation = useMutation({
    mutationFn: createSpeakerAPI,
    onSuccess: (speaker) =>
      queryClient.setQueryData<Speaker[]>(adminQueryKeys.speakers, (current) =>
        [...(current ?? []), speaker].sort((a, b) =>
          a.name.localeCompare(b.name, "pt-BR"),
        ),
      ),
  });
  const updateMutation = useMutation({
    mutationFn: updateSpeakerAPI,
    onSuccess: (speaker) =>
      queryClient.setQueryData<Speaker[]>(adminQueryKeys.speakers, (current) =>
        current?.map((item) => (item.id === speaker.id ? speaker : item)),
      ),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteSpeakerAPI,
    onSuccess: (speakerId) =>
      queryClient.setQueryData<Speaker[]>(adminQueryKeys.speakers, (current) =>
        current?.filter((item) => item.id !== speakerId),
      ),
  });

  const error =
    speakersQuery.error ||
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error;

  return {
    speakers: speakersQuery.data ?? [],
    loading:
      speakersQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar palestrantes")
      : null,
    fetchSpeakers: speakersQuery.refetch,
    fetchSpeaker: (speakerId: string) =>
      resolveAdminAction(() =>
        queryClient.fetchQuery({
          queryKey: [...adminQueryKeys.speakers, speakerId],
          queryFn: ({ signal }) => readSpeakerAPI(speakerId, signal),
        }),
      ),
    addSpeaker: (speaker: SpeakerInput) =>
      resolveAdminAction(() => createMutation.mutateAsync(speaker)),
    removeSpeaker: (speakerId: string) =>
      resolveAdminAction(() => deleteMutation.mutateAsync(speakerId)),
    updateSpeaker: (speaker: SpeakerInput) =>
      resolveAdminAction(() => updateMutation.mutateAsync(speaker)),
  };
}
