import {
  Sponsor,
  SponsorCategory,
  SponsorCategoryDisplayName,
  SponsorLevel,
} from "@/models/sponsor";
import { db } from "@/utils/db";
import { getFirestoreCollectionName } from "@/utils/db/collection-name";
import { v4 as uuidv4 } from "uuid";

const SPONSORS_COLLECTION = getFirestoreCollectionName("sponsors");

/**
 * Busca todos os SponsorLevels
 */
export const getAllSponsorLevels = async (): Promise<SponsorLevel[]> => {
  try {
    const snapshot = await db.collection(SPONSORS_COLLECTION).get();
    const levels: SponsorLevel[] = [];
    snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data && data.id) {
        levels.push(data as SponsorLevel);
      } else {
        console.warn(`[getAllSponsorLevels] Documento sem id: ${doc.id}`);
      }
    });
    levels.sort((a, b) => a.order - b.order);
    return levels;
  } catch (error) {
    console.error(
      "[getAllSponsorLevels] Erro ao buscar sponsor levels:",
      error,
    );
    throw error;
  }
};

/**
 * Cria um novo sponsor
 */
export const createSponsor = async (sponsor: Sponsor): Promise<Sponsor> => {
  try {
    if (!sponsor || !sponsor.id)
      throw new Error("Sponsor inválido: id obrigatório");
    const docRef = db.collection(SPONSORS_COLLECTION).doc(sponsor.level);
    const doc = await docRef.get();
    if (!doc.exists) {
      const displayName = Object.entries(SponsorCategoryDisplayName).find(
        ([key]) => key === sponsor.level,
      )?.[1];

      const newLevel: SponsorLevel = {
        id: uuidv4(),
        name: displayName as SponsorCategory,
        order: 0,
        items: [sponsor],
      };
      await docRef.set(newLevel);
      return sponsor;
    } else {
      const level = doc.data() as SponsorLevel;
      if (level.items.find((item) => item.id === sponsor.id)) {
        throw new Error(`Sponsor com id ${sponsor.id} já existe.`);
      }
      level.items.push(sponsor);
      await docRef.update({ items: level.items });
      return sponsor;
    }
  } catch (error) {
    console.error("[createSponsor] Erro ao criar sponsor:", error);
    throw error;
  }
};

/**
 * Busca um sponsor pelo id
 */
export const getSponsorById = async (sponsorId: string): Promise<Sponsor> => {
  try {
    if (!sponsorId) throw new Error("Id do sponsor obrigatório");
    const snapshot = await db.collection(SPONSORS_COLLECTION).get();
    for (const doc of snapshot.docs) {
      const level = doc.data() as SponsorLevel;
      const sponsor = level.items.find((item) => item.id === sponsorId);
      if (sponsor) return sponsor;
    }
    throw new Error(`Sponsor com id ${sponsorId} não encontrado.`);
  } catch (error) {
    console.error("[getSponsorById] Erro ao buscar sponsor:", error);
    throw error;
  }
};

/**
 * Atualiza um sponsor
 */
export const updateSponsor = async (sponsor: Sponsor): Promise<Sponsor> => {
  try {
    if (!sponsor || !sponsor.id)
      throw new Error("Sponsor inválido: id obrigatório");

    const snapshot = await db.collection(SPONSORS_COLLECTION).get();
    let found = false;

    for (const doc of snapshot.docs) {
      const level = doc.data() as SponsorLevel;
      const idx = level.items.findIndex((item) => item.id === sponsor.id);
      if (idx !== -1) {
        level.items.splice(idx, 1);
        await db
          .collection(SPONSORS_COLLECTION)
          .doc(doc.id)
          .update({ items: level.items });
        found = true;
        break;
      }
    }

    if (!found) throw new Error(`Sponsor com id ${sponsor.id} não encontrado.`);

    const newLevelDocRef = db
      .collection(SPONSORS_COLLECTION)
      .doc(sponsor.level);
    const newLevelDoc = await newLevelDocRef.get();

    if (!newLevelDoc.exists) {
      await createSponsor(sponsor);
    } else {
      const newLevel = newLevelDoc.data() as SponsorLevel;
      const idx = newLevel.items.findIndex((item) => item.id === sponsor.id);
      if (idx !== -1) {
        newLevel.items[idx] = sponsor;
      } else {
        newLevel.items.push(sponsor);
      }
      await newLevelDocRef.update({ items: newLevel.items });
    }

    return sponsor;
  } catch (error) {
    console.error("[updateSponsor] Erro ao atualizar sponsor:", error);
    throw error;
  }
};

/**
 * Remove um sponsor
 */
export const deleteSponsor = async (sponsorId: string): Promise<string> => {
  try {
    if (!sponsorId) throw new Error("Id do sponsor obrigatório");

    const snapshot = await db.collection(SPONSORS_COLLECTION).get();
    for (const doc of snapshot.docs) {
      const level = doc.data() as SponsorLevel;
      const idx = level.items.findIndex((item) => item.id === sponsorId);
      if (idx !== -1) {
        level.items.splice(idx, 1);
        await db
          .collection(SPONSORS_COLLECTION)
          .doc(doc.id)
          .update({ items: level.items });
        return sponsorId;
      }
    }
    throw new Error(`Sponsor com id ${sponsorId} não encontrado.`);
  } catch (error) {
    console.error("[deleteSponsor] Erro ao remover sponsor:", error);
    throw error;
  }
};
