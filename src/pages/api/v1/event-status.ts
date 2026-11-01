import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/utils/api/require-admin";
import { closeEvent, getEventStatus } from "@/back-features/event-status";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "private, no-store");
  const operator = await requireAdmin(req, res);
  if (!operator) return;
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Método não permitido" });
  }
  if (req.method === "POST" && req.body?.action !== "close")
    return res.status(400).json({ error: "Confirmação inválida" });
  try {
    return res
      .status(200)
      .json(
        req.method === "POST"
          ? await closeEvent(operator.uid)
          : await getEventStatus(),
      );
  } catch (error) {
    console.error("[event-status]", error);
    return res.status(500).json({
      error:
        "Não foi possível consultar ou encerrar o evento. Atualize o status antes de tentar novamente.",
    });
  }
}
