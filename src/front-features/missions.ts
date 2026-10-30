import { adminApiRequest } from "@/lib/admin-api/client";
import { Mission, MissionInput } from "@/models/mission";

const MISSIONS_API_PATH = "/api/v1/missions";

export const getMissionsAPI = (signal?: AbortSignal) =>
  adminApiRequest<Mission[]>(MISSIONS_API_PATH, { signal });

export const createMissionAPI = (mission: MissionInput) =>
  adminApiRequest<Mission>(MISSIONS_API_PATH, {
    method: "POST",
    body: mission,
  });

export const readMissionAPI = ({
  missionId,
  signal,
}: {
  missionId: string;
  signal?: AbortSignal;
}) => adminApiRequest<Mission>(`${MISSIONS_API_PATH}/${missionId}`, { signal });

export const updateMissionAPI = (mission: MissionInput) =>
  adminApiRequest<Mission>(`${MISSIONS_API_PATH}/${mission.id}`, {
    method: "PUT",
    body: mission,
  });

export const deleteMissionAPI = async (missionId: string) => {
  const result = await adminApiRequest<{ id: string }>(
    `${MISSIONS_API_PATH}/${missionId}`,
    { method: "DELETE" },
  );
  return result.id;
};
