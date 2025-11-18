import { Profile } from "@/models/profile";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { server } from "helpers/config";

const getToken = async (): Promise<string | undefined> => {
  const auth = getAuth();
  return auth.currentUser?.getIdToken();
};

export const getProfilesAPI = async (): Promise<Profile[]> => {
  const token = await getToken();
  try {
    const res = await axios.get(`${server}/api/v1/profiles`, {
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
