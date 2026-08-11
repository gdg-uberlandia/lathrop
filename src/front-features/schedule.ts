import { adminApiRequest } from "@/lib/admin-api/client";
import { Schedule } from "@/models/schedule";

const SCHEDULE_API_PATH = "/api/v1/schedule";

export const getScheduleAPI = (signal?: AbortSignal) =>
  adminApiRequest<Schedule[]>(SCHEDULE_API_PATH, { signal });

export const createScheduleAPI = (schedule: Schedule) =>
  adminApiRequest<Schedule>(SCHEDULE_API_PATH, {
    method: "POST",
    body: schedule,
  });

export const readScheduleAPI = (scheduleId: string, signal?: AbortSignal) =>
  adminApiRequest<Schedule>(`${SCHEDULE_API_PATH}/${scheduleId}`, { signal });

export const updateScheduleAPI = (schedule: Schedule) =>
  adminApiRequest<Schedule>(`${SCHEDULE_API_PATH}/${schedule.id}`, {
    method: "PUT",
    body: schedule,
  });

export const deleteScheduleAPI = async (scheduleId: string) => {
  const result = await adminApiRequest<{ id: string }>(
    `${SCHEDULE_API_PATH}/${scheduleId}`,
    { method: "DELETE" },
  );
  return result.id;
};
