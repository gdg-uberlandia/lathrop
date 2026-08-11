import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { scheduleSchema } from "@/components/admin/schedule/schedule-schema";
import { useAuth } from "@/context/AuthContext";
import {
  createScheduleAPI,
  deleteScheduleAPI,
  getScheduleAPI,
  readScheduleAPI,
  updateScheduleAPI,
} from "@/front-features/schedule";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";
import { Schedule } from "@/models/schedule";

export function useSchedule() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const scheduleQuery = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.schedule,
    queryFn: async ({ signal }) =>
      (await getScheduleAPI(signal)).sort((a, b) => a.end.localeCompare(b.end)),
  });
  const refreshAfterMutation = () =>
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.schedule });
  const createMutation = useMutation({
    mutationFn: createScheduleAPI,
    onSuccess: refreshAfterMutation,
  });
  const updateMutation = useMutation({
    mutationFn: updateScheduleAPI,
    onSuccess: refreshAfterMutation,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteScheduleAPI,
    onSuccess: refreshAfterMutation,
  });

  const error =
    scheduleQuery.error ||
    createMutation.error ||
    updateMutation.error ||
    deleteMutation.error;

  return {
    schedule: scheduleQuery.data ?? [],
    loading:
      scheduleQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar programação")
      : null,
    fetchSchedule: scheduleQuery.refetch,
    readSchedule: (scheduleId: string) =>
      resolveAdminAction(() =>
        queryClient.fetchQuery({
          queryKey: [...adminQueryKeys.schedule, scheduleId],
          queryFn: async ({ signal }) =>
            scheduleSchema.parse(await readScheduleAPI(scheduleId, signal)),
        }),
      ),
    createSchedule: (schedule: Schedule) =>
      resolveAdminAction(() => createMutation.mutateAsync(schedule)),
    updateSchedule: (schedule: Schedule) =>
      resolveAdminAction(() => updateMutation.mutateAsync(schedule)),
    deleteSchedule: (scheduleId: string) =>
      resolveAdminAction(() => deleteMutation.mutateAsync(scheduleId)),
  };
}
