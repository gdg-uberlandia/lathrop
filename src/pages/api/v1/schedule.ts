
import { getSchedule } from 'back-features/schedule';
import { Schedule } from 'models/schedule';
import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === 'GET') {
        getSchedule().then((schedule: any) => {
            response.json(schedule.sort((scheduleA: Schedule, scheduleB: Schedule) => {
                const startHourA = parseInt(scheduleA.start.split(':')[0], 10);
                const startHourB = parseInt(scheduleB.start.split(':')[0], 10);
                return startHourA - startHourB;
            }));
        }).catch((error: any) => {
            response.status(500).send(error);
        });
    } else {
        response.status(404)
    }
}