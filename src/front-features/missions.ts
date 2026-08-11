import { Mission, MissionInput } from "@/models/mission";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { server } from "helpers/config";

const getToken = async (): Promise<string | undefined> => {
  const auth = getAuth();
  return auth.currentUser?.getIdToken();
};

export const getMissionsAPI = async (): Promise<Mission[]> => {
  const token = await getToken();
  try {
    const res = await axios.get(`${server}/api/v1/missions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createMissionAPI = async (
  mission: MissionInput,
): Promise<Mission> => {
  const token = await getToken();
  try {
    const res = await axios.post(`${server}/api/v1/missions`, mission, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const readMissionAPI = async ({
  missionId,
}: {
  missionId: string;
}): Promise<Mission> => {
  const token = await getToken();
  try {
    const res = await axios.get(`${server}/api/v1/missions/${missionId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateMissionAPI = async (
  mission: MissionInput,
): Promise<Mission> => {
  const token = await getToken();
  try {
    const res = await axios.put(
      `${server}/api/v1/missions/${mission.id}`,
      mission,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMissionAPI = async (missionId: string): Promise<string> => {
  const token = await getToken();
  try {
    const res = await axios.delete(`${server}/api/v1/missions/${missionId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
