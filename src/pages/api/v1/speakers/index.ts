import type { NextApiRequest, NextApiResponse } from "next";
import { createSpeaker, getAllSpeakers } from "back-features/speakers";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  try {
    if (req.method === "GET") {
      const speakers = await getAllSpeakers();
      return res.status(200).json(speakers);
    }

    if (req.method === "POST") {
      const data = req.body;
      const speaker = await createSpeaker(data);
      return res.status(200).json(speaker);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Dados inválidos",
    });
  }
}
