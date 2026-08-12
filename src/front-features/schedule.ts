import {
  ScheduleBlockInput,
  ScheduleEntry,
  ScheduleInput,
} from "@/contracts/schedule";
import { adminApiRequest } from "@/lib/admin-api/client";
const PATH = "/api/v1/schedule";
export const getScheduleAPI = (signal?: AbortSignal) =>
  adminApiRequest<ScheduleEntry[]>(PATH, { signal });
export const createScheduleAPI = (body: ScheduleInput) =>
  adminApiRequest<ScheduleEntry>(PATH, { method: "POST", body });
export const readScheduleAPI = (id: string, signal?: AbortSignal) =>
  adminApiRequest<ScheduleEntry>(`${PATH}/${id}`, { signal });
export const updateScheduleAPI = (body: ScheduleInput) =>
  adminApiRequest<ScheduleEntry>(`${PATH}/${body.id}`, { method: "PUT", body });
export const deleteScheduleAPI = async (id: string) =>
  (await adminApiRequest<{ id: string }>(`${PATH}/${id}`, { method: "DELETE" }))
    .id;
export const createScheduleBlockAPI = (body: ScheduleBlockInput) =>
  adminApiRequest<ScheduleEntry[]>(`${PATH}/block`, { method: "POST", body });
