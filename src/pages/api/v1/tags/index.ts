import type { NextApiRequest, NextApiResponse } from "next";
import { createTag, getAllTags } from "@/back-features/tags";
import { requireAdmin } from "@/utils/api/require-admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  try {
    if (req.method === "GET") return res.status(200).json(await getAllTags());
    if (req.method === "POST")
      return res.status(201).json(await createTag(req.body));
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Dados inválidos",
    });
  }
}
