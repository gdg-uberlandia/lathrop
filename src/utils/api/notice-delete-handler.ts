import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { NoticeNotFoundError } from "@/back-features/notice-deletion";

type Dependencies = {
  authorize: (
    req: NextApiRequest,
    res: NextApiResponse,
  ) => Promise<{ uid: string } | null>;
  enabled: () => boolean;
  remove: (id: string, adminId: string) => Promise<string>;
};

export function createNoticeDeleteHandler(dependencies: Dependencies) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    const user = await dependencies.authorize(req, res);
    if (!user) return;
    if (!dependencies.enabled())
      return res.status(404).json({ error: "Recurso indisponível" });
    if (req.method !== "DELETE") {
      res.setHeader("Allow", "DELETE");
      return res.status(405).json({ error: "Método não permitido" });
    }
    const parsed = z.string().uuid().safeParse(req.query.noticeId);
    if (!parsed.success)
      return res.status(400).json({
        error:
          "Identificador do aviso inválido. Atualize a lista e tente novamente.",
      });
    try {
      return res
        .status(200)
        .json({ id: await dependencies.remove(parsed.data, user.uid) });
    } catch (error) {
      if (error instanceof NoticeNotFoundError)
        return res.status(404).json({
          error: "Aviso não encontrado neste evento. Atualize a lista.",
        });
      const code =
        error && typeof error === "object" && "code" in error
          ? String(error.code)
          : "unknown";
      console.error("[notices/delete] Failed to delete notice", { code });
      return res.status(500).json({
        error:
          "Não foi possível excluir o aviso. Tente novamente em instantes.",
      });
    }
  };
}
