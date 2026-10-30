import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  createTagAPI,
  deleteTagAPI,
  getTagsAPI,
  readTagAPI,
  updateTagAPI,
} from "@/front-features/tags";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import type { Tag, TagInput } from "@/contracts/tag";
import { useCallback } from "react";

export function useTags() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const query = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.tags,
    queryFn: ({ signal }) => getTagsAPI(signal),
  });
  const updateCache = (tag: Tag) =>
    client.setQueryData<Tag[]>(adminQueryKeys.tags, (items) =>
      [...(items ?? []).filter((item) => item.id !== tag.id), tag].sort(
        (a, b) => a.order - b.order,
      ),
    );
  const create = useMutation({
    mutationFn: createTagAPI,
    onSuccess: updateCache,
  });
  const update = useMutation({
    mutationFn: updateTagAPI,
    onSuccess: updateCache,
  });
  const remove = useMutation({
    mutationFn: deleteTagAPI,
    onSuccess: (id) =>
      client.setQueryData<Tag[]>(adminQueryKeys.tags, (items) =>
        items?.filter((item) => item.id !== id),
      ),
  });
  const error = query.error || create.error || update.error || remove.error;
  const fetchTag = useCallback(
    (id: string) =>
      resolveAdminAction(() =>
        client.fetchQuery({
          queryKey: [...adminQueryKeys.tags, id],
          queryFn: ({ signal }) => readTagAPI(id, signal),
        }),
      ),
    [client],
  );
  return {
    tags: query.data ?? [],
    loading:
      query.isFetching ||
      create.isPending ||
      update.isPending ||
      remove.isPending,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar tags")
      : null,
    fetchTags: query.refetch,
    fetchTag,
    addTag: (value: TagInput) =>
      resolveAdminAction(() => create.mutateAsync(value)),
    updateTag: (value: TagInput) =>
      resolveAdminAction(() => update.mutateAsync(value)),
    removeTag: (id: string) => resolveAdminAction(() => remove.mutateAsync(id)),
  };
}
