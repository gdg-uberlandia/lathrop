export interface Schedule {
    start: string;
    end: string;
    speeches: Speeches[]
}

export type Speeches = (ScheduleSpeech | ScheduleSpeedSpeech);

export interface ScheduleSpeech {
    topic: string;
    speakerSlug: string;
    path: SpeechesPath;
    duration: number;
}

export interface ScheduleSpeedSpeech extends ScheduleSpeech {
    duration: number;
}

// TODO: rename enum to correct path names
export enum SpeechesPath {
    MINAS = "MINAS", // principal
    CURADO = "CURADO",
    CANASTRA = "CANASTRA",
    COMUNIDADE = "COMUNIDADE"
}