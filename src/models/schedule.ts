export interface Schedule {
    start: string;
    end: string;
    speeches: Speeches[]
}

export type Speeches = (ScheduleSpeech | ScheduleSpeedSpeech);

export interface ScheduleSpeech {
    topic: string;
    speakerSlugs: Array<string>;
    path: SpeechesPath;
    start: string;
    end: string;
}

export interface ScheduleSpeedSpeech extends ScheduleSpeech {
    duration: number;
}

// TODO: rename enum to correct path names
export enum SpeechesPath {
    MINAS = "MINAS", // principal
    CURADO = "CURADO",
    CANASTRA = "CANASTRA",
    TRANCA = "TRANCA"
}