import db from '../utils/firebase/server';
const SPEAKERS_COLLECTION = "speakers";

interface SpeakerPayload {
    key: string,
    id: string,
    companyTitle: string,
    miniBio: string,
    name: string,
    photo: string,
    tech: string,
    title: string,
    topic: string,
    location: string
    slug: string
}

const createOrUpdateSpeaker = async ({
    key,
    id,
    companyTitle,
    miniBio,
    name,
    photo,
    tech,
    title,
    topic,
    location,
    slug
}: SpeakerPayload) => {
    const data = {
        id,
        companyTitle,
        miniBio,
        name,
        photo,
        tech,
        title,
        topic,
        location,
        slug
    };

    if (key) {
        const doc = await db.collection(SPEAKERS_COLLECTION).doc(key).get();

        if (doc.exists) {

            await db.collection(SPEAKERS_COLLECTION)
                .doc(key)
                .set(data, { merge: true });

            const speaker = await db.collection(SPEAKERS_COLLECTION).doc(key).get();

            return {
                ...speaker.data(),
                key: speaker.id,
                slug: speaker.id,
            };

        } else {
            throw new Error("Doc does not exist.");
        }
    } else {

        const speakerRef = await db.collection(SPEAKERS_COLLECTION).add(data);
        const speaker = await speakerRef.get();
        return {
            ...speaker.data(),
            slug: speaker.id,
            key: speaker.id,
        };

    }

}

const getSpeaker = async () => {
    try {

        const speakersQuerySnapshot = await db.collection(SPEAKERS_COLLECTION).get();
        const speakers: { key: string }[] = [];
        speakersQuerySnapshot.forEach(
            (doc) => speakers.push({
                ...doc.data(),
                key: doc.id,
            })
        );

        return speakers;
    } catch (error) {
        console.error(error)
    }

}

const deleteSpeaker = async (speakerId: string) => {
    if (!speakerId) throw new Error("id is blank");
    await db.collection(SPEAKERS_COLLECTION)
        .doc(speakerId.toString())
        .delete();


    return {
        key: speakerId,
    };
}

export {
    createOrUpdateSpeaker,
    getSpeaker,
    deleteSpeaker
}
