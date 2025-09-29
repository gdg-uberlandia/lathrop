import type { NextApiRequest, NextApiResponse } from "next";
import { createSponsor, getAllSponsorLevels } from "back-features/sponsors";

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
      const sponsors = await getAllSponsorLevels();
      return res.status(200).json(sponsors);
    }

    if (req.method === "POST") {
      const sponsor = req.body;
      const data = await createSponsor(sponsor);
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}
