const SPONSORS_COLLECTION = "sponsors_test";
import { SponsorLevel } from "models/sponsor-level";
import { db } from "@/utils/db";
import { v4 as uuidv4 } from "uuid";
import { SponsorsrFormValues } from "@/components/admin/sponsors/add-sponsor-form-schema";
import z from "zod";

interface SponsorPayload {
  id?: number;
  logo: string;
  name: string;
  url: string;
  level: string;
}

export enum SponsorLevelName {
  superior = "Organização",
  diamond = "Diamante",
  gold = "Ouro",
  silver = "Prata",
  bronze = "Bronze",
  iron = "Ferro",
  ruby = "Apoiador",
  support = "Parceiros",
  staff = "Staff",
}

const getSponsors = async () => {
  try {
    const sponsorsQuerySnapshot = await db
      .collection(SPONSORS_COLLECTION)
      .get();
    const sponsors: Array<SponsorLevel> = [];

    sponsorsQuerySnapshot.forEach((doc) =>
      sponsors.push({
        ...(doc.data() as SponsorLevel),
        id: doc.id,
      }),
    );

    return sponsors.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error(error);

    return [];
  }
};

const fetchSponsor = async ({
  sponsorId,
  sponsorLevel,
}: {
  sponsorId: string;
  sponsorLevel: string;
}): Promise<SponsorsrFormValues> => {
  if (!sponsorId) throw new Error("id is blank");
  try {
    if (!sponsorId || !sponsorLevel) throw new Error("id is blank");

    const sponsorRef = await db
      .collection(SPONSORS_COLLECTION)
      .doc(sponsorLevel);
    const docSnap = await sponsorRef.get();

    if (!docSnap.exists) {
      throw new Error("Documento não encontrado");
    } else {
      const docData = docSnap.data();
      const items = Array.isArray(docData?.items) ? docData.items : [];
      const item = items.find((item) => item.id === sponsorId);

      if (item && typeof item === "object") {
        return {
          ...item,
          levelName: sponsorLevel,
          level:
            SponsorLevelName[sponsorLevel as keyof typeof SponsorLevelName],
        } as SponsorsrFormValues;
      } else {
        throw new Error("Sponsor não encontrado");
      }
    }
  } catch (error) {
    console.error(error);
    return {} as SponsorsrFormValues;
  }
};

const createSponsor = async ({ data }: { data: SponsorPayload | any }) => {
  try {
    const sponsorRef = db.collection(SPONSORS_COLLECTION).doc(data.levelName);
    const docSnap = await sponsorRef.get();

    const newSponsor = {
      id: uuidv4(),
      logo: data.logo,
      name: data.name,
      url: data.url,
    };

    if (!docSnap.exists) {
      await sponsorRef.set({
        name: SponsorLevelName[data.levelName as keyof typeof SponsorLevelName],
        items: [newSponsor],
      });
    } else {
      const docData = docSnap.data();
      const items = Array.isArray(docData?.items) ? docData.items : [];
      await sponsorRef.update({
        items: [...items, newSponsor],
      });
    }

    return newSponsor;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateSponsor = async ({ data }: { data: SponsorPayload | any }) => {
  if (data.id) {
    const sponsorRef = db.collection(SPONSORS_COLLECTION).doc(data.levelName);
    const docSnap = await sponsorRef.get();

    if (!docSnap.exists) {
      throw new Error("Documento não encontrado");
    } else {
      const docData = docSnap.data();
      const items = Array.isArray(docData?.items) ? docData.items : [];

      const updatedItems = items.map((item: any) =>
        item.id === data.id
          ? { ...item, logo: data.logo, name: data.name, url: data.url }
          : item,
      );

      await sponsorRef.update({
        items: updatedItems,
      });

      return {
        ...updatedItems.filter((item) => item.id === data.id)[0],
        levelName: data.levelName,
        level: data.level,
      };
    }
  }
  throw new Error("Sponsor key is missing.");
};

const deleteSponsor = async ({
  sponsorId,
  sponsorLevel,
}: {
  sponsorId: string;
  sponsorLevel: string;
}): Promise<{ key: string }> => {
  if (!sponsorId || !sponsorLevel) throw new Error("id is blank");

  const sponsorRef = await db.collection(SPONSORS_COLLECTION).doc(sponsorLevel);
  const docSnap = await sponsorRef.get();

  if (!docSnap.exists) {
    throw new Error("Documento não encontrado");
  }

  const data = docSnap.data();
  const items = data?.items || [];

  const updatedItems = items.filter((item: any) => item.id !== sponsorId);

  await sponsorRef.update({
    items: updatedItems,
  });

  return {
    key: sponsorId,
  };
};

export {
  getSponsors,
  fetchSponsor,
  createSponsor,
  updateSponsor,
  deleteSponsor,
};
