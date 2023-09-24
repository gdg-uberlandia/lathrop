import { server } from 'helpers/config';
import { SponsorLevel } from 'models/sponsor-level';

export const getSponsors = async (): Promise<{ [key: string]: SponsorLevel } | null> => {
    try {
        const res = await fetch(`${server}/api/v1/sponsors`)
        const sponsors = await res.json();
        return sponsors;
    } catch (error) {
        console.error(error);
        return null;
    }
}