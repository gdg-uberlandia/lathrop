import { Sponsor } from "./sponsor";

export interface SponsorLevel {
  id: string;
  name: string;
  items: Array<Sponsor>;
  order: number;
}

export enum SponsorCategory {
  SUPERIOR = "superior",
  DIAMOND = "diamond",
  GOLD = "gold",
  SILVER = "silver",
  BRONZE = "bronze",
  IRON = "iron",
  RUBY = "ruby",
  SUPPORT = "support",
  STAFF = "staff",
}
