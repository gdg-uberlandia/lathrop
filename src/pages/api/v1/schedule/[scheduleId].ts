import type { NextApiRequest, NextApiResponse } from "next";
import {
  readSchedule,
  updateSchedule,
  deleteSchedule,
} from "back-features/schedule";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }

  if (req.method === "GET") {
    const { scheduleId } = req.query;
    if (typeof scheduleId === "string" && scheduleId) {
      const schedule = await readSchedule(scheduleId);
      return res.status(200).json(schedule);
    }
    return res.status(400).json({ error: "Key não informado" });
  }

  if (req.method === "PUT") {
    const { scheduleId } = req.query;
    const schedule = req.body;
    if (typeof scheduleId === "string" && scheduleId) {
      const key = await updateSchedule(schedule);
      return res.status(200).json(key);
    }
    return res.status(400).json({ error: "Key não informado" });
  }

  if (req.method === "DELETE") {
    const { scheduleId } = req.query;
    if (typeof scheduleId === "string" && scheduleId) {
      const key = await deleteSchedule(scheduleId);
      return res.status(200).json(key);
    }
    return res.status(400).json({ error: "scheduleId não informado" });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
