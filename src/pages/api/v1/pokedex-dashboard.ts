import type { NextApiRequest, NextApiResponse } from "next";
import { dashboardFiltersSchema } from "@/lib/dashboard-filter-schema";
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
  const parsed = dashboardFiltersSchema.safeParse(req.query);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Confira o período e o papel selecionados." });
  try {
    return res.status(200).json(await getPokedexDashboard(parsed.data));
  } catch (error) {
    console.error("[pokedex-dashboard] Falha ao consultar métricas", error);
    return res
      .status(500)
      .json({ error: "Não foi possível carregar o dashboard da Pokédex." });
  }
}
