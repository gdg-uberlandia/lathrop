import { SchedulePublication } from "@/contracts/schedule-publication";
import { useAuth } from "@/context/AuthContext";
import { adminApiRequest } from "@/lib/admin-api/client";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PATH = "/api/v1/schedule/publication";
export function useSchedulePublication() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const query = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.schedulePublication,
    queryFn: () => adminApiRequest<SchedulePublication>(PATH),
  });
  const update = useMutation({
    mutationFn: (published: boolean) =>
      adminApiRequest<SchedulePublication>(PATH, {
        method: "PATCH",
        body: { published },
      }),
    onSuccess: (value) =>
      client.setQueryData(adminQueryKeys.schedulePublication, value),
  });
  return {
    publication: query.data ?? null,
    loading: query.isFetching || update.isPending,
    setPublished: (published: boolean) =>
      resolveAdminAction(() => update.mutateAsync(published)),
  };
}
