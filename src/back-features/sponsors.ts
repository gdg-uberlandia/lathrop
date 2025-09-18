const SPONSORS_COLLECTION = "sponsors_test";
import { SponsorLevel } from "models/sponsor-level";
import { db } from "@/utils/db";
import { get } from "http";

interface SponsorPayload {
  id?: number;
  logo: string;
  name: string;
  url: string;
  level: string;
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

const createSponsor = async ({ data }: { data: SponsorPayload | any }) => {
  try {
    const sponsorLevel = await db
      .collection(SPONSORS_COLLECTION)
      .doc(data.level)
      .get();

    if (sponsorLevel.exists) {
      console.log(sponsorLevel);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
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

export { getSponsors, createSponsor, deleteSponsor };
