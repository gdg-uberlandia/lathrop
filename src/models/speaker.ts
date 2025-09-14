export interface Speaker {
  canBeEvaluated: boolean;
  company?: string;
  content: string;
  id: string;
  key: string;
  miniBio?: string;
  name: string;
  photo?: string;
  socialMedia?: SpeakerSocialMedia;
  tech?: SpeakerTech;
  title?: string;
  topic: string;
}

export enum SpeakerTech {
  Career = "Carreira",
  MachineLearning = "Machine Learning",
  Web = "Web",
  UI_UX = "UI/UX",
  Infra_Devops = "Infra/Devops",
}

export interface SpeakerSocialMedia {
  linkedIn?: string;
  instagram?: string;
  twitter?: string;
  github?: string;
  website?: string;
}
