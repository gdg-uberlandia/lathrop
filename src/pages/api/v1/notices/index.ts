import { isPushEnabled } from "@/back-features/push-config";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getNotices,
  isPushConfigured,
  publishNotice,
} from "@/back-features/notices";
import { requireAdmin } from "@/utils/api/require-admin";
import { ZodError } from "zod";

export const config = { maxDuration: 60 };
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  const user = await requireAdmin(req, res);
  if (!user) return;
  if (!isPushEnabled())
    return res.status(404).json({ error: "Recurso indisponível" });
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Método não permitido" });
  }
  try {
    if (req.method === "GET")
      return res.status(200).json({
        notices: await getNotices(),
        pushConfigured: isPushConfigured(),
      });
    return res.status(200).json(await publishNotice(req.body, user.uid));
  } catch (error) {
    if (error instanceof ZodError)
      return res.status(400).json({
        error:
          "Revise título, mensagem e link. Use um caminho interno da Pokedex.",
      });
    return res.status(400).json({
      error:
        "Não foi possível publicar. Confira PUSH_ENABLED e a configuração VAPID ou consulte a listagem antes de tentar novamente.",
    });
  }
}
