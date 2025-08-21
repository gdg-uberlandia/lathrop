const SPONSORS_COLLECTION = "sponsors";
import { Sponsor } from "models/sponsor";
import db from "../utils/db";

const getSponsors = async () => {
  try {
    const sponsorsQuerySnapshot = await db
      .collection(SPONSORS_COLLECTION)
      .get();
    const sponsors: Array<Sponsor> = [];
    sponsorsQuerySnapshot.forEach((doc) =>
      sponsors.push({ ...(doc.data() as Sponsor) }),
    );
    return sponsors;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export { getSponsors };
