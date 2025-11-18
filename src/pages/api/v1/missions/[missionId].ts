import {
  deletemission,
  geMissionById,
  updateMission,
} from "back-features/missions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }

  const { missionId } = req.query;
  if (typeof missionId !== "string" || !missionId) {
    return res.status(400).json({ error: "missionId não informado." });
  }

  if (req.method === "GET") {
    try {
      const mission = await geMissionById(missionId);
      return res.status(200).json(mission);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao buscar missão." });
    }
  }

  if (req.method === "PUT") {
    const mission = req.body;
    try {
      const updated = await updateMission(mission);
      return res.status(200).json(updated);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao atualizar missão." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const removedId = await deletemission(missionId);
      return res.status(200).json({ id: removedId });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao remover missão." });
    }
  }

  return res.status(405).json({ error: "Método não permitido" });
}
