export interface Schedule {
  end: string;
  id: string;
  speeches: ScheduleSpeech[];
  start: string;
}

export type Speeches = ScheduleSpeech | ScheduleSpeedSpeech;

export interface ScheduleSpeech {
  end?: string;
  id: string;
  order: number;
  path?: SpeechesPath;
  speakerSlugs?: Array<string>;
  start?: string;
  topic: string;
}

export interface ScheduleSpeedSpeech extends ScheduleSpeech {
  duration: number;
  order: number;
}

// TODO: rename enum to correct path names
export enum SpeechesPath {
  CANASTRA = "CANASTRA",
  CURADO = "CURADO",
  MINAS = "MINAS", // principal
  TRANCA = "TRANCA",
  COMMUNITY = "COMMUNITY",
}

export enum SpeechTopicName {
  coffeeBreak = "Coffee Break",
  finish = "Encerramento",
  interval = "Intervalo",
  keynote_end = "Keynote Encerramento",
  keynote_start = "Keynote Abertura",
  panel = "Painel",
  registration = "Credenciamento",
  speech = "Palestra",
  start = "Abertura",
}
