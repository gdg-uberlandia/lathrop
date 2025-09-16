import type { NextApiRequest, NextApiResponse } from "next";
import { admin } from "@/utils/db";
import {
  createSpeaker,
  getSpeakers,
  deleteSpeaker,
  updateSpeaker,
} from "back-features/speakers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }
  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const isAdmin = decoded.admin === true;

    if (req.method === "GET") {
      const speakers = await getSpeakers();
      return res.status(200).json(speakers);
    }

    if (req.method === "POST") {
      const speaker = await createSpeaker({ data: req.body });
      return res.status(200).json(speaker);
    }

    if (req.method === "PUT") {
      const speaker = await updateSpeaker({ data: req.body });
      return res.status(200).json(speaker);
    }

    if (req.method === "DELETE") {
      const { key } = req.body;
      const deleted = await deleteSpeaker(key);
      return res.status(200).json(deleted);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(403).json({ error: "Token inválido" });
  }
}
