import type { NextApiRequest, NextApiResponse } from "next";
import {
  deleteSchedule,
  readSchedule,
  updateSchedule,
} from "@/back-features/schedule";
import { requireAdmin } from "@/utils/api/require-admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  const id =
    typeof req.query.scheduleId === "string" ? req.query.scheduleId : "";
  if (!id) return res.status(400).json({ error: "scheduleId não informado" });
  try {
    if (req.method === "GET")
      return res.status(200).json(await readSchedule(id));
    if (req.method === "PUT")
      return res.status(200).json(await updateSchedule({ ...req.body, id }));
    if (req.method === "DELETE")
      return res.status(200).json({ id: await deleteSchedule(id) });
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Operação inválida",
    });
  }
}
