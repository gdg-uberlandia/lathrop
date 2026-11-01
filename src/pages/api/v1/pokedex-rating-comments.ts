import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requireAdmin } from "@/utils/api/require-admin";
import { getPokedexDashboardSource } from "@/back-features/pokedex-dashboard";
import { db } from "@/utils/db";
import { CURRENT_EVENT_ID } from "@/helpers/event";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import {
  dashboardFilterFields,
  validDashboardPeriod,
} from "@/lib/dashboard-filter-schema";
import { selectDashboardContext, analyticsText } from "@/lib/dashboard-context";
import { timestamp } from "@/lib/event-statistics-time";
const schema = z
  .object({
    ...dashboardFilterFields,
    talkId: z.string().min(1).max(128),
    page: z.coerce.number().int().min(1).max(100000).default(1),
  })
  .refine(validDashboardPeriod);
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
  const parsed = schema.safeParse(req.query);
  if (!parsed.success)
    return res.status(400).json({ error: "Confira os filtros." });
  try {
    const { talkId, page, ...filters } = parsed.data;
    const { source } = await getPokedexDashboardSource();
    const c = selectDashboardContext(source, filters);
    const snapshot = await db
      .collection(getFirestoreCollectionName("talk-ratings"))
      .where("talkId", "==", talkId)
      .select("eventId", "participantId", "completedAt", "comment")
      .get();
    const rows = snapshot.docs
      .filter(
        (d) =>
          d.data().eventId === CURRENT_EVENT_ID &&
          c.eligible({ id: d.id, ...d.data() }) &&
          c.inPeriod(d.data().completedAt) &&
          analyticsText(d.data().comment).trim(),
      )
      .map((d) => {
        const r = d.data();
        return {
          id: d.id,
          participantId: analyticsText(r.participantId),
          name:
            analyticsText(
              c.allProfiles.get(analyticsText(r.participantId))?.displayName,
            ) || "Sem nome",
          comment: analyticsText(r.comment).slice(0, 500),
          at: new Date(timestamp(r.completedAt)).toISOString(),
        };
      })
      .sort((a, b) => b.at.localeCompare(a.at));
    const pageCount = Math.max(1, Math.ceil(rows.length / 20)),
      safePage = Math.min(page, pageCount);
    return res
      .status(200)
      .json({
        items: rows.slice((safePage - 1) * 20, safePage * 20),
        total: rows.length,
        page: safePage,
        pageCount,
      });
  } catch (error) {
    console.error("[pokedex-rating-comments]", error);
    return res
      .status(500)
      .json({ error: "Não foi possível consultar os comentários." });
  }
}
