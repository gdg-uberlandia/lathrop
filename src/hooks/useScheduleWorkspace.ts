import { ScheduleEntry, scheduleFieldsSchema } from "@/contracts/schedule";
import type { Speaker } from "@/contracts/speaker";
import type { Talk } from "@/contracts/talk";
import { useAuth } from "@/context/AuthContext";
import { adminApiRequest } from "@/lib/admin-api/client";
import { adminQueryKeys } from "@/lib/admin-query";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type ScheduleWorkspaceEntry = {
  id: string;
  title: string;
  speakerNames: string[];
  typeLabel: string;
  trackLabel: string;
};
type Response = {
  schedule: ScheduleEntry[];
  talks: Talk[];
  speakers: Speaker[];
  entries: ScheduleWorkspaceEntry[];
};

export function useScheduleWorkspace() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const query = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.scheduleWorkspace,
    queryFn: async () => {
      const response = await adminApiRequest<Response>(
        "/api/v1/schedule/workspace",
      );
      const schedule = response.schedule.map((item) =>
        scheduleFieldsSchema.parse(item),
      );
      client.setQueryData(adminQueryKeys.schedule, schedule);
      return { ...response, schedule };
    },
  });
  return {
    workspace: query.data ?? null,
    loading: query.isFetching,
    error: query.error
      ? getAdminApiErrorMessage(
          query.error,
          "Erro ao carregar relações da programação",
        )
      : null,
    refresh: query.refetch,
  };
}
