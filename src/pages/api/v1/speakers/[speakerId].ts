import {
  deleteSpeaker,
  getSpeakerById,
  updateSpeaker,
} from "back-features/speakers";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  const { speakerId } = req.query;
  if (typeof speakerId !== "string" || !speakerId) {
    return res.status(400).json({ error: "speakerId não informado." });
  }

  if (req.method === "GET") {
    try {
      const speaker = await getSpeakerById(speakerId);
      return res.status(200).json(speaker);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao buscar speaker." });
    }
  }

  if (req.method === "PUT") {
    try {
      const updated = await updateSpeaker({ ...req.body, id: speakerId });
      return res.status(200).json(updated);
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: error?.message || "Erro ao atualizar speaker." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const removedId = await deleteSpeaker(speakerId);
      return res.status(200).json({ id: removedId });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao remover speaker." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}
