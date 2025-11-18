const MISSIONS_COLLECTION = `missions${process.env.DEV_MODE ? "_test" : ""}`;
import { Mission } from "@/models/mission";
import { db } from "@/utils/db/index";

/**
 * Busca todos as missoes
 */
export const getAllMissions = async (): Promise<Mission[]> => {
  try {
    const snapshot = await db.collection(MISSIONS_COLLECTION).get();
    const missions: Mission[] = [];
    snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data) {
        const mission = { ...data, id: doc.id } as Mission;

        console.log(mission);
        missions.push(mission);
      } else {
        console.warn(`[getAllMissions] Documento sem id: ${doc.id}`);
      }
    });
    return missions;
  } catch (error) {
    console.error("[getAllMissions] Erro ao buscar missions:", error);
    throw error;
  }
};

/**
 * Cria um novo mission
 */
export const createMission = async (mission: Mission): Promise<Mission> => {
  try {
    if (!mission || !mission.id) {
      throw new Error("Mission inválido: id obrigatório");
    }
    const docRef = db.collection(MISSIONS_COLLECTION).doc(mission.id);
    const doc = await docRef.get();
    if (doc.exists) {
      throw new Error(`Mission com id ${mission.id} já existe.`);
    }
    await docRef.set(mission);
    return mission;
  } catch (error) {
    console.error("[createMission] Erro ao criar mission:", error);
    throw error;
  }
};

/**
 * Busca uma missao pelo id
 */
export const geMissionById = async (missionId: string): Promise<Mission> => {
  try {
    if (!missionId) {
      throw new Error("Id do mission obrigatório");
    }
    const docRef = db.collection(MISSIONS_COLLECTION).doc(missionId);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error(`MIssao com id ${missionId} não encontrado.`);
    }
    const data = doc.data();
    if (!data || !doc.id) {
      throw new Error(`Dados inválidos para missao ${missionId}`);
    }
    return { ...data, id: doc.id } as Mission;
  } catch (error) {
    console.error("[geMissionById] Erro ao buscar mission:", error);
    throw error;
  }
};

/**
 * Atualiza um mission
 */
export const updateMission = async (mission: Mission): Promise<Mission> => {
  try {
    if (!mission || !mission.id) {
      throw new Error("mission inválido: id obrigatório");
    }
    const docRef = db.collection(MISSIONS_COLLECTION).doc(mission.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error(`mission com id ${mission.id} não encontrado.`);
    }
    await docRef.set(mission, { merge: true });
    return mission;
  } catch (error) {
    console.error("[updatemission] Erro ao atualizar mission:", error);
    throw error;
  }
};

/**
 * Remove um mission
 */
export const deletemission = async (missionId: string): Promise<string> => {
  try {
    if (!missionId) {
      throw new Error("Id do mission obrigatório");
    }
    const docRef = db.collection(MISSIONS_COLLECTION).doc(missionId);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error(`mission com id ${missionId} não encontrado.`);
    }
    await docRef.delete();
    return missionId;
  } catch (error) {
    console.error("[deletemission] Erro ao remover mission:", error);
    throw error;
  }
};
