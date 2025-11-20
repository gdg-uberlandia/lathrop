// Tipos, interfaces e enums para ScheduleFormNew

import { ScheduleFormValues } from "@/components/admin/schedule/schedule-schema";

export interface Schedule {
  id: string;
  start: string;
  end: string;
  speeches: Speech[];
}

export type Speech =
  | {
      id: string;
      topic: "registration" | "start" | "interval" | "coffeeBreak" | "finish";
      order: number;
    }
  | {
      id: string;
      topic: "keynote_start" | "keynote_end";
      speakerSlugs: string[];
      order: number;
    }
  | {
      id: string;
      topic: "speech";
      path?: SpeechesPath;
      speakerSlugs: string[];
      order: number;
    }
  | {
      id: string;
      title?: string;
      topic: "panel";
      path?: SpeechesPath;
      speakerSlugs: string[];
      order: number;
    };

export enum SpeechesPath {
  MINAS = "MINAS",
  CURADO = "CURADO",
  CANASTRA = "CANASTRA",
  TRANCA = "TRANCA",
  COMMUNITY = "COMMUNITY",
}

export type SpeechTopicName =
  | "registration"
  | "start"
  | "keynote_start"
  | "interval"
  | "coffeeBreak"
  | "speech"
  | "panel"
  | "keynote_end"
  | "finish";

export interface ScheduleFormProps {
  onSubmit: (data: Schedule) => void;
  loading?: boolean;
  schedule?: ScheduleFormValues;
  editing?: boolean;
}
