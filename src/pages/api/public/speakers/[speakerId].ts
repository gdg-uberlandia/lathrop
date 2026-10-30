import { getSpeakerById } from "@/back-features/speakers";
import { getAllTalks } from "@/back-features/talks";
import { toPublicSpeaker } from "@/contracts/speaker";
import { toPublicTalk } from "@/contracts/talk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const speakerId =
    typeof req.query.speakerId === "string" ? req.query.speakerId : null;
  if (!speakerId) {
    return res.status(400).json({ error: "speakerId não informado." });
  }

  try {
    const [speaker, talks] = await Promise.all([
      getSpeakerById(speakerId),
      getAllTalks(),
    ]);

    if (!speaker.isVisible) {
      return res.status(404).json({ error: "Palestrante não encontrado." });
    }

    const activeTalks = talks.filter(
      (talk) => talk.isActive && talk.speakerIds.includes(speaker.id),
    );

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=3600",
    );
    return res.status(200).json({
      speaker: toPublicSpeaker(speaker),
      talks: activeTalks.map(toPublicTalk),
    });
  } catch {
    return res.status(404).json({ error: "Palestrante não encontrado." });
  }
}
