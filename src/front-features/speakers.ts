import { getAuth } from "firebase/auth";
import { server } from "helpers/config";
import { Speaker } from "models/speaker";

const SPEAKERS_COLLECTION = "speakers";

const getToken = async () => {
  const auth = getAuth();
  return auth.currentUser?.getIdToken();
};

export const getSpeakers = async (): Promise<Speaker[]> => {
  const token = await getToken();

  const res = await fetch(`${server}/api/v1/${SPEAKERS_COLLECTION}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erro ao buscar speakers");
  return res.json();
};

export const createSpeakerAPI = async (speaker: any) => {
  const token = await getToken();

  const res = await fetch(`${server}/api/v1/${SPEAKERS_COLLECTION}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(speaker),
  });

  if (!res.ok) throw new Error("Erro ao criar speaker");
  const speakerRes = await res.json();
  return speakerRes;
};

export const deleteSpeakerAPI = async (key: string) => {
  const token = await getToken();

  const res = await fetch(`${server}/api/v1/${SPEAKERS_COLLECTION}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ key }),
  });

  if (!res.ok) throw new Error("Erro ao deletar speaker");
  return res.json();
};

export const updateSpeakerAPI = async (speaker: Speaker) => {
  const token = await getToken();

  const res = await fetch(`${server}/api/v1/${SPEAKERS_COLLECTION}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(speaker),
  });

  if (!res.ok) throw new Error("Erro ao atualizar speaker");
  const speakerRes = await res.json();
  return speakerRes;
};
