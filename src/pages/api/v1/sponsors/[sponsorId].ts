import type { NextApiRequest, NextApiResponse } from "next";
import { deleteSponsor, fetchSponsor } from "back-features/sponsors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }

  if (req.method === "GET") {
    const { sponsorId, sponsorLevel } = req.query;
    if (
      typeof sponsorId === "string" &&
      sponsorId &&
      typeof sponsorLevel === "string" &&
      sponsorLevel
    ) {
      const sponsor = await fetchSponsor({
        sponsorId,
        sponsorLevel,
      });

      return res.status(200).json(sponsor);
    }
    return res.status(400).json({ error: "Id não informado" });
  }

  if (req.method === "DELETE") {
    const { sponsorId, sponsorLevel } = req.query;
    if (
      typeof sponsorId === "string" &&
      sponsorId &&
      typeof sponsorLevel === "string" &&
      sponsorLevel
    ) {
      const key = await deleteSponsor({ sponsorId, sponsorLevel });

      return res.status(200).json(key);
    }
    return res.status(400).json({ error: "Id não informado" });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
