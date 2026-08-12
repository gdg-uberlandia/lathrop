import {
  getSchedulePublication,
  updateSchedulePublication,
} from "@/back-features/schedule-publication";
import { requireAdmin } from "@/utils/api/require-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  try {
    if (req.method === "GET")
      return res.status(200).json(await getSchedulePublication());
    if (req.method === "PATCH")
      return res.status(200).json(await updateSchedulePublication(req.body));
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Operação inválida",
    });
  }
}
