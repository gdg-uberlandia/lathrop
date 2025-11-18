const PROFILES_COLLECTION = `profiles${process.env.DEV_MODE ? "_test" : ""}`;
import { Profile } from "@/models/profile";
import { db } from "@/utils/db/index";

/**
 * Busca todos os profiles
 */
export const getAllProfiles = async (): Promise<Profile[]> => {
  try {
    const snapshot = await db.collection(PROFILES_COLLECTION).get();
    const profiles: Profile[] = [];
    snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data && data.id) {
        profiles.push(data as Profile);
      } else {
        console.warn(`[getAllProfiles] Documento sem id: ${doc.id}`);
      }
    });
    return profiles;
  } catch (error) {
    console.error("[getAllProfiles] Erro ao buscar profiles:", error);
    throw error;
  }
};

/**
 * Busca profiles por email (busca parcial usando range query)
 * Firestore não suporta LIKE, então usamos range query para buscar emails que começam com o termo
 */
export const searchProfilesByEmail = async (
  searchTerm: string,
): Promise<Profile[]> => {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const searchLower = searchTerm.toLowerCase();

    // Firestore range query: busca emails que começam com o termo
    // Para buscar "john", pega todos entre "john" e "john\uf8ff"
    const endTerm = searchLower + "\uf8ff";

    const snapshot = await db
      .collection(PROFILES_COLLECTION)
      .where("user.email", ">=", searchLower)
      .where("user.email", "<=", endTerm)
      .limit(20) // Limitar resultados para performance
      .get();

    const profiles: Profile[] = [];
    snapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data && data.id) {
        profiles.push({
          id: doc.id,
          email: data.user.email,
          name: data.user.name,
          photoURL: data.user.photoUrl,
        } as Profile);
      }
    });

    profiles.sort((a, b) => a.email.localeCompare(b.email));
    return profiles;
  } catch (error) {
    console.error("[searchProfilesByEmail] Erro ao buscar profiles:", error);
    throw error;
  }
};

/**
 * Busca um profile pelo id
 */
export const getProfileById = async (profileId: string): Promise<Profile> => {
  try {
    if (!profileId) {
      throw new Error("Id do profile obrigatório");
    }
    const docRef = db.collection(PROFILES_COLLECTION).doc(profileId);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error(`Profile com id ${profileId} não encontrado.`);
    }
    const data = doc.data();
    if (!data || !data.id) {
      throw new Error(`Dados inválidos para profile ${profileId}`);
    }
    return data as Profile;
  } catch (error) {
    console.error("[getProfileById] Erro ao buscar profile:", error);
    throw error;
  }
};
