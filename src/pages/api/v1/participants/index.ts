import type { NextApiRequest, NextApiResponse } from "next";
import {
  listParticipants,
  updateParticipantRoles,
} from "@/back-features/participants";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  if (!(await requireAdmin(req, res))) return;
  try {
    if (req.method === "GET")
      return res.status(200).json(await listParticipants());
    if (req.method === "PATCH")
      return res.status(200).json(await updateParticipantRoles(req.body));
    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Erro ao processar participantes",
    });
  }
}
