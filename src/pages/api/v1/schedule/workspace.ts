import { getScheduleWorkspace } from "@/back-features/schedule-workspace";
import { requireAdmin } from "@/utils/api/require-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "GET")
    return res.status(405).json({ error: "Método não permitido" });
  try {
    return res.status(200).json(await getScheduleWorkspace());
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível carregar a programação",
    });
  }
}
