const SCHEDULE_COLLECTION = "schedule";
import db from '../utils/db';

const getSchedule = async () => {
    const scheduleQuerySnapshot = await db.collection(SCHEDULE_COLLECTION).get();
    const schedule: any[] = []; // eslint-disable-line
    scheduleQuerySnapshot.forEach(
        (doc) => schedule.push({ ...doc.data() })
    );
    return schedule;
}


export {
    getSchedule
}