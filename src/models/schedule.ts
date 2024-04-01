export interface Schedule {
    start: string;
    end: string;
    speeches: Speeches[]
}

export type Speeches = ScheduleSpeech | ScheduleSpeedSpeech | ScheduleMultipleSpeech;

export interface ScheduleSpeech {
    topic: string;
    speakerKey: string;
    path: SpeechesPath;
    start: string;
    end: string;
}

export interface ScheduleMultipleSpeech extends ScheduleSpeech {
    speakerKeys: Array<string>;
    speakerKey: never;
}

export interface ScheduleSpeedSpeech extends ScheduleSpeech {
    duration: number;
}
export enum SpeechesPath {
    MINAS = "MINAS", // principal
    CURADO = "CURADO",
    CANASTRA = "CANASTRA",
    COMUNIDADE = "COMUNIDADE"
}