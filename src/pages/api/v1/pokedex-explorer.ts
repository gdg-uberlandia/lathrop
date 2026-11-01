import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requireAdmin } from "@/utils/api/require-admin";
import { getPokedexDashboardSource } from "@/back-features/pokedex-dashboard";
import { exploreDashboardParticipants } from "@/lib/dashboard-explorer";
import {
  dashboardFilterFields,
  validDashboardPeriod,
} from "@/lib/dashboard-filter-schema";
const schema = z
  .object({
    ...dashboardFilterFields,
    segment: z.enum([
      "all",
      "active",
      "inactive",
      "band",
      "company",
      "hour",
      "journey",
      "interest",
      "reward",
      "talk",
      "network",
    ]),
    value: z.string().max(160).default(""),
    q: z.string().max(200).default(""),
    page: z.coerce.number().int().min(1).max(100000).default(1),
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
    return res.status(400).json({ error: "Confira os filtros da consulta." });
  try {
    const cached = await getPokedexDashboardSource();
    const { segment, value, q, page } = parsed.data;
    return res
      .status(200)
      .json(
        exploreDashboardParticipants(
          cached.source,
          { role: "participant" },
          segment,
          value,
          q,
          page,
        ),
      );
  } catch (error) {
    console.error("[pokedex-explorer]", error);
    return res
      .status(500)
      .json({ error: "Não foi possível consultar os participantes." });
  }
}
