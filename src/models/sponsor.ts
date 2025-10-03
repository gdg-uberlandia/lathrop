export interface Sponsor {
  id?: string;
  logo: string;
  name: string;
  url: string;
  level: string;
}

export enum SponsorCategory {
  BRONZE = "bronze",
  DIAMOND = "diamond",
  GOLD = "gold",
  IRON = "iron",
  RUBY = "ruby",
  SILVER = "silver",
  STAFF = "staff",
  SUPERIOR = "superior",
  SUPPORT = "support",
  CARAVANS = "caravans",
}

export const SponsorCategoryDisplayName: Record<SponsorCategory, string> = {
  [SponsorCategory.BRONZE]: "Bronze",
  [SponsorCategory.DIAMOND]: "Diamante",
  [SponsorCategory.GOLD]: "Ouro",
  [SponsorCategory.IRON]: "Ferro",
  [SponsorCategory.RUBY]: "Apoiador",
  [SponsorCategory.SILVER]: "Prata",
  [SponsorCategory.STAFF]: "Staff",
  [SponsorCategory.SUPERIOR]: "Organização",
  [SponsorCategory.SUPPORT]: "Parceiros",
  [SponsorCategory.CARAVANS]: "Caravanas",
};

export interface SponsorLevel {
  id: string;
  items: Sponsor[];
  name: SponsorCategory;
  order: number;
}
