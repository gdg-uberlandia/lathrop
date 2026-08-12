import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  createScheduleAPI,
  createScheduleBlockAPI,
  deleteScheduleAPI,
  getScheduleAPI,
  readScheduleAPI,
  updateScheduleAPI,
  updateScheduleVisibilityAPI,
} from "@/front-features/schedule";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";
import {
  ScheduleEntry,
  ScheduleInput,
  ScheduleBlockInput,
  scheduleFieldsSchema,
} from "@/contracts/schedule";
export function useSchedule() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const query = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.schedule,
    queryFn: async ({ signal }) =>
      (await getScheduleAPI(signal)).map((item) =>
        scheduleFieldsSchema.parse(item),
      ),
  });
  const updateCache = (item: ScheduleEntry) =>
    client.setQueryData<ScheduleEntry[]>(adminQueryKeys.schedule, (items) =>
      [
        ...(items ?? []).filter((entry) => entry.id !== item.id),
        scheduleFieldsSchema.parse(item),
      ].sort((a, b) => a.startAt.getTime() - b.startAt.getTime()),
    );
  const refreshWorkspace = () =>
    client.invalidateQueries({ queryKey: adminQueryKeys.scheduleWorkspace });
  const create = useMutation({
    mutationFn: createScheduleAPI,
    onSuccess: (item) => {
      updateCache(item);
      void refreshWorkspace();
    },
  });
  const createBlock = useMutation({
    mutationFn: createScheduleBlockAPI,
    onSuccess: (created) => {
      client.setQueryData<ScheduleEntry[]>(adminQueryKeys.schedule, (items) =>
        [
          ...(items ?? []),
          ...created.map((item) => scheduleFieldsSchema.parse(item)),
        ].sort(
          (a, b) =>
            a.startAt.getTime() - b.startAt.getTime() ||
            (a.order ?? -1) - (b.order ?? -1),
        ),
      );
      void refreshWorkspace();
    },
  });
  const update = useMutation({
    mutationFn: updateScheduleAPI,
    onSuccess: (item) => {
      updateCache(item);
      void refreshWorkspace();
    },
  });
  const updateVisibility = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateScheduleVisibilityAPI(id, active),
    onSuccess: updateCache,
  });
  const remove = useMutation({
    mutationFn: deleteScheduleAPI,
    onSuccess: (id) => {
      client.setQueryData<ScheduleEntry[]>(adminQueryKeys.schedule, (items) =>
        items?.filter((item) => item.id !== id),
      );
      void refreshWorkspace();
    },
  });
  const error =
    query.error ||
    create.error ||
    createBlock.error ||
    update.error ||
    updateVisibility.error ||
    remove.error;
  return {
    schedule: query.data ?? [],
    loading:
      query.isFetching ||
      create.isPending ||
      createBlock.isPending ||
      update.isPending ||
      updateVisibility.isPending ||
      remove.isPending,
    visibilityUpdatingId: updateVisibility.isPending
      ? updateVisibility.variables?.id
      : null,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar programação")
      : null,
    fetchSchedule: query.refetch,
    readSchedule: (id: string) =>
      resolveAdminAction(() =>
        client.fetchQuery({
          queryKey: [...adminQueryKeys.schedule, id],
          queryFn: async ({ signal }) =>
            scheduleFieldsSchema.parse(await readScheduleAPI(id, signal)),
        }),
      ),
    createSchedule: (value: ScheduleInput) =>
      resolveAdminAction(() => create.mutateAsync(value)),
    createScheduleBlock: (value: ScheduleBlockInput) =>
      resolveAdminAction(() => createBlock.mutateAsync(value)),
    updateSchedule: (value: ScheduleInput) =>
      resolveAdminAction(() => update.mutateAsync(value)),
    updateScheduleVisibility: (id: string, active: boolean) =>
      resolveAdminAction(() => updateVisibility.mutateAsync({ id, active })),
    deleteSchedule: (id: string) =>
      resolveAdminAction(() => remove.mutateAsync(id)),
  };
}
