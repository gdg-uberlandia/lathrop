import { Sponsor } from "./sponsor";

export interface SponsorLevel {
  id: string;
  name: string;
  items: Array<Sponsor>;
  order: number;
}

export enum SponsorCategory {
  BRONZE = "bronze",
  IRON = "iron",
  RUBY = "ruby",
  STAFF = "staff",
  SUPERIOR = "superior",
  SUPPORT = "support",
  CARAVANS = "caravans",
}
