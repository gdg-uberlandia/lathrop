import type { NextApiRequest, NextApiResponse } from "next";
import { moveSchedule } from "@/back-features/schedule";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método não permitido" });
  try {
    return res.status(200).json(await moveSchedule(req.body));
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível mover a atividade.",
    });
  }
}
