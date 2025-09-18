import { getSponsors, createSponsor } from "back-features/sponsors";
import type { NextApiRequest, NextApiResponse } from "next";

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
      const sponsors = await getSponsors();
      return res.status(200).json(sponsors);
    }

    if (req.method === "POST") {
      const sponsor = await createSponsor({ data: req.body });
      return res.status(200).json(sponsor);
    }
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(403).json({ error: "Token inválido" });
  }
}
