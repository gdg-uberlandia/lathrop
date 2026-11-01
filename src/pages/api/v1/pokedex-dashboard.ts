import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/utils/api/require-admin";
import { getPokedexDashboard } from "@/back-features/pokedex-dashboard";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "private, no-store");
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido" });
  }
  try {
    return res.status(200).json(await getPokedexDashboard());
  } catch (error) {
    console.error("[pokedex-dashboard] Falha ao consultar métricas", error);
    return res
      .status(500)
      .json({ error: "Não foi possível carregar o dashboard da Pokédex." });
  }
}
