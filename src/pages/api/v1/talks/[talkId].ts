import { deleteTalk, getTalkById, updateTalk } from "@/back-features/talks";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  const talkId = typeof req.query.talkId === "string" ? req.query.talkId : null;
  if (!talkId) return res.status(400).json({ error: "talkId não informado" });
  try {
    if (req.method === "GET")
      return res.status(200).json(await getTalkById(talkId));
    if (req.method === "PUT")
      return res
        .status(200)
        .json(await updateTalk({ ...req.body, id: talkId }));
    if (req.method === "DELETE")
      return res.status(200).json({ id: await deleteTalk(talkId) });
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Dados inválidos",
    });
  }
}
