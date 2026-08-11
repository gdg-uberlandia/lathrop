import type { NextApiRequest, NextApiResponse } from "next";
import {
  readSchedule,
  updateSchedule,
  deleteSchedule,
} from "back-features/schedule";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

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
