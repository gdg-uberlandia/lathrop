import { z } from "zod";
import {
  RewardInput,
  RewardUpdate,
  rewardFieldsSchema,
} from "@/contracts/reward";
import { adminApiRequest } from "@/lib/admin-api/client";
const PATH = "/api/v1/rewards";
const responseSchema = rewardFieldsSchema.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export const getRewardsAPI = async (signal?: AbortSignal) =>
  z
    .array(responseSchema)
    .parse(await adminApiRequest<unknown>(PATH, { signal }));
export const readRewardAPI = async (id: string, signal?: AbortSignal) =>
  responseSchema.parse(
    await adminApiRequest<unknown>(`${PATH}/${id}`, { signal }),
  );
export const createRewardAPI = async (body: RewardInput) =>
  responseSchema.parse(
    await adminApiRequest<unknown>(PATH, { method: "POST", body }),
  );
export const updateRewardAPI = async (body: RewardUpdate) =>
  responseSchema.parse(
    await adminApiRequest<unknown>(`${PATH}/${body.id}`, {
      method: "PUT",
      body,
    }),
  );
