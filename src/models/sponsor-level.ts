import { Sponsor } from "./sponsor";

export interface SponsorLevel {
  id: string;
  name: string;
  items: Array<Sponsor>;
}

export enum SponsorCategory {
  BRONZE = "bronze",
  IRON = "iron",
  RUBY = "ruby",
  STAFF = "staff",
  SUPERIOR = "superior",
  SUPPORT = "support",
}
