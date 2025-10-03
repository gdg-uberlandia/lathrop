const SPEAKERS_COLLECTION = `speakers${process.env.DEV_MODE ? "_test" : ""}`;
import { Speaker } from "@/models/speaker";
import { db } from "@/utils/db/index";

/**
 * Busca todos os speakers
 */
export const getAllSpeakers = async (): Promise<Speaker[]> => {
  try {
    const snapshot = await db.collection(SPEAKERS_COLLECTION).get();
    const speakers: Speaker[] = [];
    snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data && data.id) {
        speakers.push(data as Speaker);
      } else {
        console.warn(`[getAllSpeakers] Documento sem id: ${doc.id}`);
      }
    });
    speakers.sort((a, b) => a.name.localeCompare(b.name));
    return speakers;
  } catch (error) {
    console.error("[getAllSpeakers] Erro ao buscar speakers:", error);
    throw error;
  }
};

/**
 * Cria um novo speaker
 */
export const createSpeaker = async (speaker: Speaker): Promise<Speaker> => {
  try {
    if (!speaker || !speaker.id) {
      throw new Error("Speaker inválido: id obrigatório");
    }
    const docRef = db.collection(SPEAKERS_COLLECTION).doc(speaker.id);
    const doc = await docRef.get();
    if (doc.exists) {
      throw new Error(`Speaker com id ${speaker.id} já existe.`);
    }
    speaker.canBeEvaluated = false;
    await docRef.set(speaker);
    return speaker;
  } catch (error) {
    console.error("[createSpeaker] Erro ao criar speaker:", error);
    throw error;
  }
};

/**
 * Busca um speaker pelo id
 */
export const getSpeakerById = async (speakerId: string): Promise<Speaker> => {
  try {
    if (!speakerId) {
      throw new Error("Id do speaker obrigatório");
    }
    const docRef = db.collection(SPEAKERS_COLLECTION).doc(speakerId);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error(`Speaker com id ${speakerId} não encontrado.`);
    }
    const data = doc.data();
    if (!data || !data.id) {
      throw new Error(`Dados inválidos para speaker ${speakerId}`);
    }
    return data as Speaker;
  } catch (error) {
    console.error("[getSpeakerById] Erro ao buscar speaker:", error);
    throw error;
  }
};

/**
 * Atualiza um speaker
 */
export const updateSpeaker = async (speaker: Speaker): Promise<Speaker> => {
  try {
    if (!speaker || !speaker.id) {
      throw new Error("Speaker inválido: id obrigatório");
    }
    const docRef = db.collection(SPEAKERS_COLLECTION).doc(speaker.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error(`Speaker com id ${speaker.id} não encontrado.`);
    }
    await docRef.set(speaker, { merge: true });
    return speaker;
  } catch (error) {
    console.error("[updateSpeaker] Erro ao atualizar speaker:", error);
    throw error;
  }
};

/**
 * Remove um speaker
 */
export const deleteSpeaker = async (speakerId: string): Promise<string> => {
  try {
    if (!speakerId) {
      throw new Error("Id do speaker obrigatório");
    }
    const docRef = db.collection(SPEAKERS_COLLECTION).doc(speakerId);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error(`Speaker com id ${speakerId} não encontrado.`);
    }
    await docRef.delete();
    return speakerId;
  } catch (error) {
    console.error("[deleteSpeaker] Erro ao remover speaker:", error);
    throw error;
  }
};
