import axios from "axios";
import { getAuth } from "firebase/auth";
import { server } from "helpers/config";
import { Speaker } from "models/speaker";

const SPEAKERS_COLLECTION = "speakers";

const getToken = async (): Promise<string | undefined> => {
  const auth = getAuth();
  return auth.currentUser?.getIdToken();
};

export const getSpeakersAPI = async (): Promise<Speaker[]> => {
  const token = await getToken();
  try {
    console.log("[API] GET /speakers");
    const res = await axios.get(`${server}/api/v1/${SPEAKERS_COLLECTION}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("[API] GET /speakers - erro:", error);
    throw error;
  }
};

export const createSpeakerAPI = async (speaker: Speaker): Promise<Speaker> => {
  const token = await getToken();
  try {
    console.log(`[API] POST /speakers - criando: ${speaker.id}`);
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
  } catch (error) {
    console.error(`[API] POST /speakers - erro:`, error);
    throw error;
  }
};

export const readSpeakerAPI = async (speakerId: string): Promise<Speaker> => {
  const token = await getToken();
  try {
    console.log(`[API] GET /speakers/${speakerId}`);
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
  } catch (error) {
    console.error(`[API] GET /speakers/${speakerId} - erro:`, error);
    throw error;
  }
};

export const updateSpeakerAPI = async (speaker: any): Promise<Speaker> => {
  const token = await getToken();
  try {
    console.log(`[API] PUT /speakers/${speaker.id}`);
    const res = await axios.put(
      `${server}/api/v1/${SPEAKERS_COLLECTION}/${speaker.id}`,
      speaker,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error(`[API] PUT /speakers/${speaker.id} - erro:`, error);
    throw error;
  }
};

export const deleteSpeakerAPI = async (speakerId: string): Promise<string> => {
  const token = await getToken();
  try {
    console.log(`[API] DELETE /speakers/${speakerId}`);
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
  } catch (error) {
    console.error(`[API] DELETE /speakers/${speakerId} - erro:`, error);
    throw error;
  }
};
