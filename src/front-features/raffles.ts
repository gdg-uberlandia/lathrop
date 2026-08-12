import { Raffle, RaffleInput } from "@/contracts/raffle";
import { adminApiRequest } from "@/lib/admin-api/client";
const PATH = "/api/v1/raffles";
export const getRafflesAPI = (signal?: AbortSignal) =>
  adminApiRequest<Raffle[]>(PATH, { signal });
export const readRaffleAPI = (id: string, signal?: AbortSignal) =>
  adminApiRequest<Raffle>(`${PATH}/${id}`, { signal });
export const createRaffleAPI = (body: RaffleInput) =>
  adminApiRequest<Raffle>(PATH, { method: "POST", body });
export const updateRaffleAPI = (body: RaffleInput) =>
  adminApiRequest<Raffle>(`${PATH}/${body.id}`, { method: "PUT", body });
export const deleteRaffleAPI = async (id: string) =>
  (await adminApiRequest<{ id: string }>(`${PATH}/${id}`, { method: "DELETE" }))
    .id;
