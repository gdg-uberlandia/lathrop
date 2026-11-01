import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requireAdmin } from "@/utils/api/require-admin";
import { getPokedexDashboardSource } from "@/back-features/pokedex-dashboard";
import {
  dashboardFilterFields,
  validDashboardPeriod,
} from "@/lib/dashboard-filter-schema";
import { selectDashboardContext } from "@/lib/dashboard-context";
import { buildConnectionNetwork } from "@/lib/connection-network";
const schema = z
  .object({
    ...dashboardFilterFields,
    focusId: z.string().max(128).default(""),
  })
  .refine(validDashboardPeriod);
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
  const parsed = schema.safeParse(req.query);
  if (!parsed.success)
    return res.status(400).json({ error: "Confira os filtros." });
  try {
    const { focusId, ...filters } = parsed.data;
    const { source } = await getPokedexDashboardSource();
    return res
      .status(200)
      .json(
        buildConnectionNetwork(
          selectDashboardContext(source, { role: "participant" }),
          focusId,
        ),
      );
  } catch (error) {
    console.error("[pokedex-network]", error);
    return res
      .status(500)
      .json({ error: "Não foi possível consultar a rede." });
  }
}
