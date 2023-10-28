export interface Speaker {
  tech: SpeakerTech
  miniBio: string
  name: string
  topic: string
  photo: string
  id: number
  socialMedia: SpeakerSocialMedia
  title: string
  content: string
  company: string
  key: string
}

export enum SpeakerTech {
  Career = 'Carreira',
  MachineLearning = "Machine Learning",
  Web = "Web",
  UI_UX = "UI/UX",
  Infra_Devops = "Infra/Devops"
}

export interface SpeakerSocialMedia {
  linkedIn: string
  instagram: string
}
