export interface Schedule {
    start: string;
    end: string;
    speeches: Speeches[]
}

export type Speeches = (ScheduleSpeeches | ScheduleSpeedSpeeches);

export interface ScheduleSpeeches {
    topic: string;
    speakerSlug: string;
    path: SpeechesPath;
}

export interface ScheduleSpeedSpeeches extends ScheduleSpeeches {
    duration: number; 
}

// TODO: rename enum to correct path names
export enum SpeechesPath {
    ONE,
    TWO,
    THREE,
    SPEED
}