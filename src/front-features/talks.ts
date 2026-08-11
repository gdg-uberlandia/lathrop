import axios from "axios";
import { getAuth } from "firebase/auth";
import { server } from "@/helpers/config";
import { Talk, TalkInput } from "@/models/talk";

const TALKS_API_PATH = "talks";
const getToken = async () => getAuth().currentUser?.getIdToken();
const headers = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getToken()}`,
});

export const getTalksAPI = async (): Promise<Talk[]> =>
  (
    await axios.get(`${server}/api/v1/${TALKS_API_PATH}`, {
      headers: await headers(),
    })
  ).data;

export const createTalkAPI = async (talk: TalkInput): Promise<Talk> =>
  (
    await axios.post(`${server}/api/v1/${TALKS_API_PATH}`, talk, {
      headers: await headers(),
    })
  ).data;

export const readTalkAPI = async (talkId: string): Promise<Talk> =>
  (
    await axios.get(`${server}/api/v1/${TALKS_API_PATH}/${talkId}`, {
      headers: await headers(),
    })
  ).data;

export const updateTalkAPI = async (talk: TalkInput): Promise<Talk> =>
  (
    await axios.put(`${server}/api/v1/${TALKS_API_PATH}/${talk.id}`, talk, {
      headers: await headers(),
    })
  ).data;

export const deleteTalkAPI = async (talkId: string): Promise<string> => {
  await axios.delete(`${server}/api/v1/${TALKS_API_PATH}/${talkId}`, {
    headers: await headers(),
  });
  return talkId;
};
