import { server } from 'helpers/config';
import { Schedule } from 'models/schedule';

export const getSchedule = async (): Promise<Schedule[]> => {
    try {
        const url = `${server}/api/v1/schedule`;
        const res = await fetch(url);
        const schedule = await res.json();
        return schedule;
    } catch (error) {
        console.error(error);
        return [];
    }
}