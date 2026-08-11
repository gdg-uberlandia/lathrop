import { Speaker, SpeakerInput } from "@/contracts/speaker";
import { adminApiRequest } from "@/lib/admin-api/client";

const SPEAKERS_API_PATH = "/api/v1/speakers";

export const getSpeakersAPI = (signal?: AbortSignal) =>
  adminApiRequest<Speaker[]>(SPEAKERS_API_PATH, { signal });

export const createSpeakerAPI = (speaker: SpeakerInput) =>
  adminApiRequest<Speaker>(SPEAKERS_API_PATH, {
    method: "POST",
    body: speaker,
  });

export const readSpeakerAPI = (speakerId: string, signal?: AbortSignal) =>
  adminApiRequest<Speaker>(`${SPEAKERS_API_PATH}/${speakerId}`, { signal });

export const updateSpeakerAPI = (speaker: SpeakerInput) =>
  adminApiRequest<Speaker>(`${SPEAKERS_API_PATH}/${speaker.id}`, {
    method: "PUT",
    body: speaker,
  });

export const deleteSpeakerAPI = async (speakerId: string) => {
  const result = await adminApiRequest<{ id: string }>(
    `${SPEAKERS_API_PATH}/${speakerId}`,
    { method: "DELETE" },
  );
  return result.id;
};
