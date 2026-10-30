import { getAllCompanies } from "@/back-features/companies";
import { getAllMissions } from "@/back-features/missions";
import { getAllRaffles } from "@/back-features/raffles";
import { getSchedule } from "@/back-features/schedule";
import { getAllSpeakers } from "@/back-features/speakers";
import { getAllSponsorLevels } from "@/back-features/sponsors";
import { getAllTags } from "@/back-features/tags";
import { getAllTalks } from "@/back-features/talks";
import { requireAdmin } from "@/utils/api/require-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "GET")
    return res.status(405).json({ error: "Método não permitido" });
  try {
    const [
      speakers,
      sponsors,
      talks,
      missions,
      schedule,
      companies,
      tags,
      raffles,
    ] = await Promise.all([
      getAllSpeakers(),
      getAllSponsorLevels(),
      getAllTalks(),
      getAllMissions(),
      getSchedule(),
      getAllCompanies(),
      getAllTags(),
      getAllRaffles(),
    ]);
    return res.status(200).json({
      speakers,
      sponsors,
      talks,
      missions,
      schedule,
      companies,
      tags,
      raffles,
    });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o painel",
    });
  }
}
