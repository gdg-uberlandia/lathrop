import { Sponsor } from "./sponsor";

export interface SponsorLevel {
  id?: number;
  name: string;
  items: Array<Sponsor>;
}
