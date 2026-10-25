import type { NextApiRequest, NextApiResponse } from "next";
import { getReward, updateReward } from "@/back-features/rewards";
import { requireAdmin } from "@/utils/api/require-admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  const id = typeof req.query.rewardId === "string" ? req.query.rewardId : "";
  if (!id) return res.status(400).json({ error: "Brinde não informado." });
  try {
    if (req.method === "GET") return res.status(200).json(await getReward(id));
    if (req.method === "PUT")
      return res.status(200).json(await updateReward({ ...req.body, id }));
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível processar o brinde.",
    });
  }
}
