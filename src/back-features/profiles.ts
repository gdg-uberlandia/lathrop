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
 * Busca profiles por email ou nome usando queries nativas do Firestore
 * Usa range queries para buscar termos que COMEÇAM com o searchTerm
 * Executa 2 queries em paralelo (email e nome) e combina os resultados
 */
export const searchProfilesByEmail = async (
  searchTerm: string,
): Promise<Profile[]> => {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    const searchLower = searchTerm.toLowerCase();
    const endTerm = searchLower + "\uf8ff";

    // Executar 2 queries em paralelo: busca por email E por nome
    const [emailSnapshot, nameSnapshot] = await Promise.all([
      // Query 1: Buscar por email que começa com o termo
      db
        .collection(PROFILES_COLLECTION)
        .where("user.email", ">=", searchLower)
        .where("user.email", "<=", endTerm)
        .limit(10)
        .get(),

      // Query 2: Buscar por nome que começa com o termo
      db
        .collection(PROFILES_COLLECTION)
        .where("user.name", ">=", searchLower)
        .where("user.name", "<=", endTerm)
        .limit(10)
        .get(),
    ]);

    // Usar Map para evitar duplicatas (mesmo profile pode aparecer nas 2 queries)
    const profilesMap = new Map<string, Profile>();

    // Processar resultados da busca por email
    emailSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data && data.user) {
        profilesMap.set(doc.id, {
          id: doc.id,
          email: data.user.email,
          name: data.user.name,
          photoURL: data.user.photoUrl,
        } as Profile);
      }
    });

    // Processar resultados da busca por nome
    nameSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data && doc.id && data.user) {
        profilesMap.set(doc.id, {
          id: doc.id,
          email: data.user.email,
          name: data.user.name,
          photoURL: data.user.photoUrl,
        } as Profile);
      }
    });

    // Converter Map para array e ordenar
    const profiles = Array.from(profilesMap.values());
    profiles.sort((a, b) => a.email.localeCompare(b.email));

    // Limitar a 20 resultados
    return profiles.slice(0, 20);
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
    if (!data || !doc.id) {
      throw new Error(`Dados inválidos para profile ${profileId}`);
    }
    return data as Profile;
  } catch (error) {
    console.error("[getProfileById] Erro ao buscar profile:", error);
    throw error;
  }
};
