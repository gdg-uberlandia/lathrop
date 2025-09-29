const SCHEDULE_COLLECTION = "schedule_test";
import { db } from "@/utils/db";

const getSchedule = async () => {
  try {
    const scheduleQuerySnapshot = await db
      .collection(SCHEDULE_COLLECTION)
      .get();
    const schedule: any[] = [];
    scheduleQuerySnapshot.forEach((doc) => schedule.push({ ...doc.data() }));

    return schedule;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createSchedule = async (data: any) => {
  try {
    const scheduleName = `${data.start}-${data.end}`;
    const scheduleRef = db.collection(SCHEDULE_COLLECTION).doc(scheduleName);
    const docSnap = await scheduleRef.get();

    if (!docSnap.exists) {
      await scheduleRef.set({ ...data });
    } else {
      const docData = docSnap.data();
      const speeches = Array.isArray(docData?.speeches) ? docData.speeches : [];
      await scheduleRef.update({
        speeches: [...speeches, ...data.speeches],
      });
    }

    const schedule = await scheduleRef.get();
    return schedule.data();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const readSchedule = async (scheduleId: string) => {
  try {
    if (!scheduleId) throw new Error("scheduleId is blank");

    const scheduleQuery = await db
      .collection(SCHEDULE_COLLECTION)
      .where("id", "==", scheduleId)
      .get();

    if (scheduleQuery.empty) throw new Error("Schedule not found");

    const scheduleRef = scheduleQuery.docs[0].ref;
    const docSnap = await scheduleRef.get();

    return docSnap.data();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateSchedule = async (schedule: any) => {
  try {
    if (!schedule?.id) throw new Error("scheduleId is blank");

    const scheduleQuery = await db
      .collection(SCHEDULE_COLLECTION)
      .where("id", "==", schedule.id)
      .get();

    if (scheduleQuery.empty) throw new Error("Document not found");

    const scheduleRef = scheduleQuery.docs[0].ref;
    const docSnap = await scheduleRef.get();

    if (!docSnap.exists) throw new Error("Document not found");
    else {
      const newSchedule = {
        end: schedule.end,
        id: schedule.id,
        speeches: [...schedule.speeches],
        start: schedule.start,
      };

      await scheduleRef.set(newSchedule, {
        merge: true,
      });

      const updatedDocSnap = await scheduleRef.get();
      return updatedDocSnap.data();
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteSchedule = async (scheduleId: string) => {
  try {
    if (!scheduleId) throw new Error("scheduleId is blank");

    const scheduleQuery = await db
      .collection(SCHEDULE_COLLECTION)
      .where("id", "==", scheduleId)
      .get();

    if (scheduleQuery.empty) throw new Error("Document not found");

    const scheduleRef = scheduleQuery.docs[0].ref;
    const docSnap = await scheduleRef.get();

    if (!docSnap.exists) throw new Error("Document not found");
    else {
      await scheduleRef.delete();
    }

    return scheduleId;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  getSchedule,
  createSchedule,
  readSchedule,
  updateSchedule,
  deleteSchedule,
};
