import type { NextApiRequest, NextApiResponse } from "next";
import { createSchedule, getSchedule } from "back-features/schedule";
import { Schedule } from "models/schedule";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  try {
    if (req.method === "GET") {
      const schedule = await getSchedule();
      const scheduleSorted = schedule
        ? schedule.sort((scheduleA: Schedule, scheduleB: Schedule) => {
            const startHourA = parseInt(scheduleA.start.split(":")[0], 10);
            const startHourB = parseInt(scheduleB.start.split(":")[0], 10);
            return startHourA - startHourB;
          })
        : [];
      return res.status(200).json(scheduleSorted);
    }

    if (req.method === "POST") {
      const data = req.body;
      const schedule = await createSchedule(data);
      return res.status(200).json(schedule);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(403).json({ error: "Token inválido" });
  }
}
