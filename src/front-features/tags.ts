import { Tag, TagInput } from "@/contracts/tag";
import { adminApiRequest } from "@/lib/admin-api/client";
const PATH = "/api/v1/tags";
export const getTagsAPI = (signal?: AbortSignal) =>
  adminApiRequest<Tag[]>(PATH, { signal });
export const readTagAPI = (id: string, signal?: AbortSignal) =>
  adminApiRequest<Tag>(`${PATH}/${id}`, { signal });
export const createTagAPI = (body: TagInput) =>
  adminApiRequest<Tag>(PATH, { method: "POST", body });
export const updateTagAPI = (body: TagInput) =>
  adminApiRequest<Tag>(`${PATH}/${body.id}`, { method: "PUT", body });
export const deleteTagAPI = async (id: string) =>
  (await adminApiRequest<{ id: string }>(`${PATH}/${id}`, { method: "DELETE" }))
    .id;
