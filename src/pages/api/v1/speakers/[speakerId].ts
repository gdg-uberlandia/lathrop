import type { NextApiRequest, NextApiResponse } from "next";
import {
  getSpeakerById,
  updateSpeaker,
  deleteSpeaker,
} from "back-features/speakers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const logPrefix = "[API/Speaker]";
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    console.warn(`${logPrefix} Token não informado.`);
    return res.status(401).json({ error: "Token não informado." });
  }

  const { speakerId } = req.query;

  if (req.method === "GET") {
    if (typeof speakerId !== "string" || !speakerId) {
      console.warn(`${logPrefix} GET - speakerId não informado.`);
      return res.status(400).json({ error: "speakerId não informado." });
    }
    try {
      const speaker = await getSpeakerById(speakerId);
      console.log(`${logPrefix} GET - Speaker encontrado: ${speakerId}`);
      return res.status(200).json(speaker);
    } catch (error: any) {
      console.error(`${logPrefix} GET - Erro:`, error);
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao buscar speaker." });
    }
  }

  if (req.method === "PUT") {
    if (typeof speakerId !== "string" || !speakerId) {
      console.warn(`${logPrefix} PUT - speakerId não informado.`);
      return res.status(400).json({ error: "speakerId não informado." });
    }
    const speaker = req.body;
    try {
      const updated = await updateSpeaker(speaker);
      console.log(`${logPrefix} PUT - Speaker atualizado: ${speakerId}`);
      return res.status(200).json(updated);
    } catch (error: any) {
      console.error(`${logPrefix} PUT - Erro:`, error);
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao atualizar speaker." });
    }
  }

  if (req.method === "DELETE") {
    if (typeof speakerId !== "string" || !speakerId) {
      console.warn(`${logPrefix} DELETE - speakerId não informado.`);
      return res.status(400).json({ error: "speakerId não informado." });
    }
    try {
      const removedId = await deleteSpeaker(speakerId);
      console.log(`${logPrefix} DELETE - Speaker removido: ${removedId}`);
      return res.status(200).json({ id: removedId });
    } catch (error: any) {
      console.error(`${logPrefix} DELETE - Erro:`, error);
      return res
        .status(500)
        .json({ error: error?.message || "Erro ao remover speaker." });
    }
  }

  console.warn(`${logPrefix} Método não permitido: ${req.method}`);
  return res.status(405).json({ error: "Método não permitido." });
}
