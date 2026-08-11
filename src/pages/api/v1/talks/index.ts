import { createTalk, getAllTalks } from "@/back-features/talks";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  try {
    if (req.method === "GET") return res.status(200).json(await getAllTalks());
    if (req.method === "POST")
      return res.status(201).json(await createTalk(req.body));
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Dados inválidos",
    });
  }
}
