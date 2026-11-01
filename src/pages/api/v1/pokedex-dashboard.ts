import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requireAdmin } from "@/utils/api/require-admin";
import { getPokedexDashboard } from "@/back-features/pokedex-dashboard";
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(`${v}T00:00:00Z`)) &&
      new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v,
    "Data inválida",
  );
const schema = z
  .object({
    from: date.optional(),
    to: date.optional(),
    role: z
      .enum([
        "all",
        "participant",
        "staff",
        "reviewer",
        "sponsor",
        "editor",
        "admin",
      ])
      .default("all"),
  })
  .refine((v) => !v.from || !v.to || v.from <= v.to, "Período inválido");
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
