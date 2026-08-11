import axios from "axios";
import { getAuth } from "firebase/auth";
import { server } from "@/helpers/config";
import { Schedule } from "@/models/schedule";

const SCHEDULE_COLLECTION = `schedule${process.env.DEV_MODE ? "_test" : ""}`;

const getToken = async (): Promise<string | undefined> => {
  const auth = getAuth();
  return auth.currentUser?.getIdToken();
};

export const getScheduleAPI = async (): Promise<Schedule[]> => {
  const token = await getToken();
  const res = await axios.get(`${server}/api/v1/${SCHEDULE_COLLECTION}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createScheduleAPI = async (schedule: Schedule) => {
  const token = await getToken();
  const res = await axios.post(
    `${server}/api/v1/${SCHEDULE_COLLECTION}`,
    schedule,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const readScheduleAPI = async (scheduleId: string) => {
  const token = await getToken();
  const res = await axios.get(
    `${server}/api/v1/${SCHEDULE_COLLECTION}/${scheduleId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const updateScheduleAPI = async (schedule: any) => {
  const token = await getToken();
  const res = await axios.put(
    `${server}/api/v1/${SCHEDULE_COLLECTION}/${schedule.id}`,
    schedule,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const deleteScheduleAPI = async (scheduleId: string) => {
  const token = await getToken();
  const res = await axios.delete(
    `${server}/api/v1/${SCHEDULE_COLLECTION}/${scheduleId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
