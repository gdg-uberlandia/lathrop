export interface Schedule {
    start: string;
    end: string;
    speeches: {
        topic?: string;
        speakerSlug?: string;
    }[]
}
