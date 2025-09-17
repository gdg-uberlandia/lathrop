import { getAuth } from "firebase/auth";
import { server } from "helpers/config";
import { Speaker } from "models/speaker";
import axios from "axios";

const SPEAKERS_COLLECTION = "speakers";

const getToken = async (): Promise<string | undefined> => {
  const auth = getAuth();
  return auth.currentUser?.getIdToken();
};

export const getSpeakers = async (): Promise<Speaker[]> => {
  const token = await getToken();
  const res = await axios.get(`${server}/api/v1/${SPEAKERS_COLLECTION}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchSpeakerAPI = async (speakerId: string): Promise<Speaker> => {
  const token = await getToken();
  const res = await axios.get(
    `${server}/api/v1/${SPEAKERS_COLLECTION}/${speakerId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const createSpeakerAPI = async (speaker: any) => {
  const token = await getToken();
  const res = await axios.post(
    `${server}/api/v1/${SPEAKERS_COLLECTION}`,
    speaker,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const deleteSpeakerAPI = async (speakerId: string) => {
  const token = await getToken();
  const res = await axios.delete(
    `${server}/api/v1/${SPEAKERS_COLLECTION}/${speakerId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const updateSpeakerAPI = async (speaker: Speaker) => {
  const token = await getToken();
  const res = await axios.put(
    `${server}/api/v1/${SPEAKERS_COLLECTION}`,
    speaker,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
