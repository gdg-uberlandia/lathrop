import type { NextApiRequest, NextApiResponse } from "next";
import { createSpeaker, getAllSpeakers } from "back-features/speakers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }

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
