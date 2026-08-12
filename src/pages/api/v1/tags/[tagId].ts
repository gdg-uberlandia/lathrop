import type { NextApiRequest, NextApiResponse } from "next";
import { deleteTag, getTagById, updateTag } from "@/back-features/tags";
import { requireAdmin } from "@/utils/api/require-admin";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  const id = typeof req.query.tagId === "string" ? req.query.tagId : "";
  if (!id) return res.status(400).json({ error: "tagId não informado." });
  try {
    if (req.method === "GET") return res.status(200).json(await getTagById(id));
    if (req.method === "PUT")
      return res.status(200).json(await updateTag({ ...req.body, id }));
    if (req.method === "DELETE")
      return res.status(200).json({ id: await deleteTag(id) });
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Operação inválida",
    });
  }
}
