import type { NextApiRequest, NextApiResponse } from "next";
import { createMission, getAllMissions } from "@/back-features/missions";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  try {
    if (req.method === "GET") {
      const missions = await getAllMissions();
      return res.status(200).json(missions);
    }

    if (req.method === "POST") {
      const mission = await createMission(req.body);
      return res.status(201).json(mission);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Dados inválidos",
    });
  }
}
