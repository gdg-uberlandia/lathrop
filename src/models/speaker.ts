import type { Speaker } from "@/contracts/speaker";

export * from "@/contracts/speaker";

/** Compatibility type used only by archived event components. */
export type LegacySpeaker = Speaker & {
  content?: string;
  photo?: string;
  tech?: string;
  topic?: string;
};

export enum SpeakerTech {
  Career = "Carreira",
  Infra_Devops = "Infra/Devops",
  MachineLearning = "Machine Learning",
  UI_UX = "UI/UX",
  Web = "Web",
}
