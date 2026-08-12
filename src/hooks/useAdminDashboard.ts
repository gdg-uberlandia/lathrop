import type { Company } from "@/contracts/company";
import type { Raffle } from "@/contracts/raffle";
import { ScheduleEntry, scheduleFieldsSchema } from "@/contracts/schedule";
import type { Speaker } from "@/contracts/speaker";
import type { Tag } from "@/contracts/tag";
import type { Talk } from "@/contracts/talk";
import { useAuth } from "@/context/AuthContext";
import { adminApiRequest } from "@/lib/admin-api/client";
import { adminQueryKeys } from "@/lib/admin-query";
import type { Mission } from "@/models/mission";
import type { SponsorLevel } from "@/models/sponsor";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type DashboardData = {
  speakers: Speaker[];
  sponsors: SponsorLevel[];
  talks: Talk[];
  missions: Mission[];
  schedule: ScheduleEntry[];
  companies: Company[];
  tags: Tag[];
  raffles: Raffle[];
};
const empty: DashboardData = {
  speakers: [],
  sponsors: [],
  talks: [],
  missions: [],
  schedule: [],
  companies: [],
  tags: [],
  raffles: [],
};

export function useAdminDashboard() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const query = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.dashboard,
    queryFn: async () => {
      const response =
        await adminApiRequest<DashboardData>("/api/v1/dashboard");
      const data = {
        ...response,
        schedule: response.schedule.map((item) =>
          scheduleFieldsSchema.parse(item),
        ),
      };
      const caches = [
        [adminQueryKeys.speakers, data.speakers],
        [adminQueryKeys.sponsors, data.sponsors],
        [adminQueryKeys.talks, data.talks],
        [adminQueryKeys.missions, data.missions],
        [adminQueryKeys.schedule, data.schedule],
        [adminQueryKeys.companies, data.companies],
        [adminQueryKeys.tags, data.tags],
        [adminQueryKeys.raffles, data.raffles],
      ] as const;
      caches.forEach(([key, value]) => client.setQueryData(key, value));
      return data;
    },
  });
  return {
    data: query.data ?? empty,
    loading: query.isFetching,
    error: query.error,
  };
}
