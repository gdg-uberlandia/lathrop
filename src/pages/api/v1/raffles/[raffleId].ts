import type { NextApiRequest, NextApiResponse } from "next";
import {
  deleteRaffle,
  getRaffleById,
  updateRaffle,
} from "@/back-features/raffles";
import { requireAdmin } from "@/utils/api/require-admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  const id = typeof req.query.raffleId === "string" ? req.query.raffleId : "";
  if (!id) return res.status(400).json({ error: "raffleId não informado." });
  try {
    if (req.method === "GET")
      return res.status(200).json(await getRaffleById(id));
    if (req.method === "PUT")
      return res.status(200).json(await updateRaffle({ ...req.body, id }));
    if (req.method === "DELETE")
      return res.status(200).json({ id: await deleteRaffle(id) });
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Operação inválida",
    });
  }
}
