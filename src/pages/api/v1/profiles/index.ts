import { searchProfilesByEmail } from "@/back-features/profiles";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;

  try {
    if (req.method === "GET") {
      const { search } = req.query;
      const searchTerm = typeof search === "string" ? search : "";

      // Se não houver termo de busca, retornar array vazio
      if (!searchTerm || searchTerm.length < 2) {
        return res.status(200).json([]);
      }

      // Buscar diretamente no Firestore com filtro
      const profiles = await searchProfilesByEmail(searchTerm);
      return res.status(200).json(profiles);
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (err) {
    console.error("[profiles/index] Erro:", err);
    return res.status(500).json({ error: "Erro ao buscar profiles" });
  }
}
