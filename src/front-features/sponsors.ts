import { getAuth } from "firebase/auth";
import { server } from "helpers/config";
import { SponsorLevel } from "models/sponsor-level";
import axios from "axios";

const SPONSORS_COLLECTION = "sponsors";

const getToken = async (): Promise<string | undefined> => {
  const auth = getAuth();
  return auth.currentUser?.getIdToken();
};

export const fetchSponsorsAPI = async (): Promise<SponsorLevel[]> => {
  const token = await getToken();
  const res = await axios.get(`${server}/api/v1/${SPONSORS_COLLECTION}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteSponsorAPI = async ({
  sponsorId,
  sponsorLevel,
}: {
  sponsorId: string;
  sponsorLevel: string;
}) => {
  const token = await getToken();
  const res = await axios.delete(
    `${server}/api/v1/${SPONSORS_COLLECTION}/${sponsorId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { sponsorLevel },
    },
  );
  return res.data;
};
