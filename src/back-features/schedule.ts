const SCHEDULE_COLLECTION = "schedule";
import db from '../utils/firebase/server';

const getSchedule = async () => {
    try {

        const scheduleQuerySnapshot = await db.collection(SCHEDULE_COLLECTION).get();
        const schedule: any[] = []; // eslint-disable-line
        scheduleQuerySnapshot.forEach(
            (doc) => schedule.push({ ...doc.data() })
        );
        return schedule;
    } catch (error) {
        console.error(error);
    }
}


export {
    getSchedule
}