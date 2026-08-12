import { Talk, TalkInput } from "@/contracts/talk";
import { adminApiRequest } from "@/lib/admin-api/client";

const TALKS_API_PATH = "talks";

export const getTalksAPI = async (signal?: AbortSignal): Promise<Talk[]> =>
  adminApiRequest(`/api/v1/${TALKS_API_PATH}`, { signal });

export const createTalkAPI = async (talk: TalkInput): Promise<Talk> =>
  adminApiRequest(`/api/v1/${TALKS_API_PATH}`, { method: "POST", body: talk });

export const readTalkAPI = async (
  talkId: string,
  signal?: AbortSignal,
): Promise<Talk> =>
  adminApiRequest(`/api/v1/${TALKS_API_PATH}/${talkId}`, { signal });

export const updateTalkAPI = async (talk: TalkInput): Promise<Talk> =>
  adminApiRequest(`/api/v1/${TALKS_API_PATH}/${talk.id}`, {
    method: "PUT",
    body: talk,
  });

export const deleteTalkAPI = async (talkId: string): Promise<string> => {
  const result = await adminApiRequest<{ id: string }>(
    `/api/v1/${TALKS_API_PATH}/${talkId}`,
    { method: "DELETE" },
  );
  return result.id;
};
