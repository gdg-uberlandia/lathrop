export interface Schedule {
    start: string;
    end: string;
    speeches: {
        topic?: string;
        speakerSlug?: string;
        path: SpeechesPath;
    }[]
}

// TODO: rename enum to correct path names
export enum SpeechesPath {
    ONE,
    TWO,
    THREE,
}