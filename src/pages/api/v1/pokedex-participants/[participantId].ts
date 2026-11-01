import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/utils/api/require-admin";
import { getParticipantStatistics } from "@/back-features/participant-statistics";
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
  const id = req.query.participantId;
  if (
    typeof id !== "string" ||
    !id.trim() ||
    id.length > 128 ||
    /[\/\u0000-\u001f]/.test(id) ||
    id === "." ||
    id === ".."
  )
    return res.status(400).json({ error: "Participante inválido" });
  try {
    const statistics = await getParticipantStatistics(id);
    if (!statistics) {
      const error =
        "Perfil não encontrado neste evento. Ele pode ter sido removido.";
      return res.status(404).json({ error });
    }
    return res.status(200).json(statistics);
  } catch (error) {
    console.error(
      "[participant-statistics] Falha ao consultar participante",
      error,
    );
    const message =
      "Não foi possível carregar as estatísticas do participante.";
    return res.status(500).json({ error: message });
  }
}
