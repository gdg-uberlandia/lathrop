import type { NextApiRequest, NextApiResponse } from "next";
import { createSponsor, getAllSponsorLevels } from "back-features/sponsors";
import { requireAuth } from "@/utils/api/require-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAuth(req, res))) return;

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
