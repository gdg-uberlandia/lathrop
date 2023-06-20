export interface Speaker {
  id?: number;
  slug: string;
  name?: string;
  tech?: string;
  topic?: string;
  title?: string;
  content?: string;
  miniBio?: string;
  path?: string;
  photo?: string;
  community?: string;
  company?: string;
  companyTitle?: string;
  socialMedia?: {
    instagram: string;
    twitter: string;
    linkedIn: string;
    github: string;
    website: string;
  };
}
