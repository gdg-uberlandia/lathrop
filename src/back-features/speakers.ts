import { db } from "@/utils/db";
const SPEAKERS_COLLECTION = "speakers_test";
import { Speaker } from "@/models/speaker";
interface SpeakerPayload {
  companyTitle: string;
  id: string;
  key?: string;
  location: string;
  mini_bio: string;
  name: string;
  photo: string;
  tech: string;
  title: string;
  topic: string;
}

const createSpeaker = async ({
  data,
}: {
  data: SpeakerPayload | any;
}): Promise<SpeakerPayload | null> => {
  try {
    const speakerRef = await db
      .collection(SPEAKERS_COLLECTION)
      .add(JSON.parse(JSON.stringify(data)));
    const speaker = await speakerRef.get();

    return {
      ...speaker.data(),
      key: speaker.id,
    } as SpeakerPayload;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getSpeakers = async (): Promise<SpeakerPayload[]> => {
  try {
    const speakersQuerySnapshot = await db
      .collection(SPEAKERS_COLLECTION)
      .get();
    const speakers: SpeakerPayload[] = [];
    speakersQuerySnapshot.forEach((doc) =>
      speakers.push({
        ...doc.data(),
        key: doc.id,
        id: doc.id,
      } as SpeakerPayload),
    );

    return speakers;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const updateSpeaker = async ({ data }: { data: Speaker }): Promise<Speaker> => {
  if (data.key) {
    const doc = await db.collection(SPEAKERS_COLLECTION).doc(data.key).get();

    if (doc.exists) {
      await db
        .collection(SPEAKERS_COLLECTION)
        .doc(data.key)
        .set(data, { merge: true });

      const speaker = await db
        .collection(SPEAKERS_COLLECTION)
        .doc(data.key)
        .get();

      return {
        ...speaker.data(),
        key: speaker.id,
      } as Speaker;
    } else {
      throw new Error("Doc does not exist.");
    }
  }
  throw new Error("Speaker key is missing.");
};

const deleteSpeaker = async (speakerId: string): Promise<{ key: string }> => {
  if (!speakerId) throw new Error("id is blank");
  await db.collection(SPEAKERS_COLLECTION).doc(speakerId.toString()).delete();

  return {
    key: speakerId,
  };
};

export { createSpeaker, getSpeakers, updateSpeaker, deleteSpeaker };
