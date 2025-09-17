import type { NextApiRequest, NextApiResponse } from "next";
import { deleteSpeaker, fetchSpeaker } from "back-features/speakers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }

  if (req.method === "GET") {
    const { speakerId } = req.query;
    if (typeof speakerId === "string" && speakerId) {
      const speaker = await fetchSpeaker(speakerId);

      return res.status(200).json(speaker);
    }
    return res.status(400).json({ error: "Key não informado" });
  }

  if (req.method === "DELETE") {
    const { speakerId } = req.query;
    if (typeof speakerId === "string" && speakerId) {
      const key = await deleteSpeaker(speakerId);

      return res.status(200).json(key);
    }
    return res.status(400).json({ error: "Key não informado" });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
