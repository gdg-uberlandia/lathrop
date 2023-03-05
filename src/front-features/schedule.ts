import { server } from 'helpers/config';
import { Schedule } from 'models/schedule';

export const getSchedule = async (): Promise<Schedule[]> => {
    const url = `${server}/api/v1/schedule`;

    //console.log(url);
    const res = await fetch(url);
    const schedule = await res.json();
    return schedule;
}