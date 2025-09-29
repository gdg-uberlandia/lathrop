import {
  deleteSponsor,
  getSponsorById,
  updateSponsor,
} from "back-features/sponsors";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }

  const { sponsorId } = req.query;
  if (typeof sponsorId !== "string" || !sponsorId) {
    return res.status(400).json({ error: "sponsorId não informado." });
  }

  if (req.method === "GET") {
    try {
      const sponsor = await getSponsorById(sponsorId);
      return res.status(200).json(sponsor);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao buscar sponsor." });
    }
  }

  if (req.method === "PUT") {
    const sponsor = req.body;
    try {
      const updated = await updateSponsor(sponsor);
      return res.status(200).json(updated);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao atualizar sponsor." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const removedId = await deleteSponsor(sponsorId);
      return res.status(200).json({ id: removedId });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao remover sponsor." });
    }
  }

  return res.status(405).json({ error: "Método não permitido" });
}
