const SPONSORS_COLLECTION = "sponsors";
import { SponsorLevel } from "models/sponsor-level";
import db from "../utils/db";

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

export { getSponsors };
