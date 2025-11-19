export interface Speaker {
  canBeEvaluated?: boolean;
  company?: string;
  content: string;
  id: string;
  miniBio?: string;
  name: string;
  photo?: string;
  socialMedia?: SpeakerSocialMedia;
  tech?: string;
  title?: string;
  topic: string;
  showSpeaker?: boolean;
}

export enum SpeakerTech {
  Career = "Carreira",
  Infra_Devops = "Infra/Devops",
  MachineLearning = "Machine Learning",
  UI_UX = "UI/UX",
  Web = "Web",
}

export interface SpeakerSocialMedia {
  github?: string;
  instagram?: string;
  linkedIn?: string;
  twitter?: string;
  website?: string;
}
