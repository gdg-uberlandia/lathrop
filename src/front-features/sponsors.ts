const SPONSORS_COLLECTION = "sponsors";
import { Sponsor, SponsorLevel } from "@/models/sponsor";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { server } from "helpers/config";

const getToken = async (): Promise<string | undefined> => {
  const auth = getAuth();
  return auth.currentUser?.getIdToken();
};

export const getSponsorsAPI = async (): Promise<SponsorLevel[]> => {
  const token = await getToken();
  try {
    const res = await axios.get(`${server}/api/v1/${SPONSORS_COLLECTION}`, {
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

export const createSponsorAPI = async (
  sponsor: Sponsor,
): Promise<SponsorLevel> => {
  const token = await getToken();
  try {
    const res = await axios.post(
      `${server}/api/v1/${SPONSORS_COLLECTION}`,
      sponsor,
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

export const readSponsorAPI = async ({
  sponsorId,
  sponsorLevel,
}: {
  sponsorId: string;
  sponsorLevel: string;
}): Promise<Sponsor> => {
  const token = await getToken();
  try {
    const res = await axios.get(
      `${server}/api/v1/${SPONSORS_COLLECTION}/${sponsorId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: { sponsorLevel },
      },
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateSponsorAPI = async (sponsor: Sponsor): Promise<Sponsor> => {
  const token = await getToken();
  try {
    const res = await axios.put(
      `${server}/api/v1/${SPONSORS_COLLECTION}/${sponsor.id}`,
      sponsor,
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

export const deleteSponsorAPI = async (sponsorId: string): Promise<string> => {
  const token = await getToken();
  try {
    const res = await axios.delete(
      `${server}/api/v1/${SPONSORS_COLLECTION}/${sponsorId}`,
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
