import {
  deleteMission,
  getMissionById,
  updateMission,
} from "@/back-features/missions";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  const { missionId } = req.query;
  if (typeof missionId !== "string" || !missionId) {
    return res.status(400).json({ error: "missionId não informado." });
  }

  if (req.method === "GET") {
    try {
      const mission = await getMissionById(missionId);
      return res.status(200).json(mission);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao buscar missão." });
    }
  }

  if (req.method === "PUT") {
    try {
      const updated = await updateMission({ ...req.body, id: missionId });
      return res.status(200).json(updated);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao atualizar missão." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const removedId = await deleteMission(missionId);
      return res.status(200).json({ id: removedId });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao remover missão." });
    }
  }

  return res.status(405).json({ error: "Método não permitido" });
}
