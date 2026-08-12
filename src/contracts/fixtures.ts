import type { Company } from "./company";
import type { Mission } from "./mission";
import type { Raffle } from "./raffle";
import type { Reward } from "./reward";
import type { Speaker } from "./speaker";
import type { Tag } from "./tag";
import type { Talk } from "./talk";

const createdAt = new Date("2026-01-10T12:00:00.000Z");
const updatedAt = new Date("2026-01-11T12:00:00.000Z");

export const companyFixture = {
  id: "google",
  eventId: "devfest-triangulo-2026",
  qrId: "13be3fb8-79ca-40c5-9d8b-ea323b215e91",
  name: "Google",
  description: "Empresa participante do evento.",
  logoUrl: "https://example.com/google-logo.png",
  stampImageUrl: "https://example.com/google-stamp.png",
  active: true,
  xpAwarded: 50,
  createdAt,
  updatedAt,
} satisfies Company;

export const missionFixture = {
  id: "visite-google",
  eventId: "devfest-triangulo-2026",
  qrId: "5ec7f497-ed9e-48cf-bf7f-65427b066fb1",
  title: "Visite o estande do Google",
  description: "Leia o QR code disponível no estande.",
  imageUrl: "https://example.com/mission.png",
  validationType: "qr",
  progressRequirement: null,
  prerequisites: [{ type: "company", activityId: "google" }],
  active: true,
  order: 1,
  xpAwarded: 100,
  createdAt,
  updatedAt,
} satisfies Mission;

export const speakerFixture = {
  id: "ada-lovelace",
  eventId: "devfest-triangulo-2026",
  name: "Ada Lovelace",
  company: "Analytical Engines",
  title: "Engenheira de software",
  miniBio: "Palestrante do DevFest.",
  photoUrl: "https://example.com/ada.png",
  socialMedia: {
    instagram: null,
    linkedIn: "https://www.linkedin.com/in/ada-lovelace",
  },
  isVisible: true,
  createdAt,
  updatedAt,
} satisfies Speaker;

export const talkFixture = {
  id: "computacao-no-seculo-xxi",
  eventId: "devfest-triangulo-2026",
  title: "Computação no século XXI",
  description: "Uma conversa sobre o futuro da computação.",
  category: "Web",
  format: "talk",
  speakerIds: [speakerFixture.id],
  evaluationStatus: "open",
  isActive: true,
  createdAt,
  updatedAt,
} satisfies Talk;

export const tagFixture = {
  id: "tag-comunidade",
  eventId: "devfest-triangulo-2026",
  qrId: "23088b57-35f4-4df1-b454-1b84fbb91bb5",
  name: "Comunidade",
  description: "Tag disponível na área da comunidade.",
  imageUrl: "https://example.com/tag.png",
  active: true,
  order: 1,
  xpAwarded: 25,
  createdAt,
  updatedAt,
} satisfies Tag;

export const raffleFixture = {
  id: "notebook",
  eventId: "devfest-triangulo-2026",
  prizeName: "Notebook",
  description: "Prêmio principal do evento.",
  imageUrl: "https://example.com/notebook.png",
  order: 1,
  active: true,
  status: "pending",
  currentAttemptId: null,
  currentCandidateId: null,
  currentCandidateName: null,
  winnerId: null,
  winnerName: null,
  eligibleParticipantCount: null,
  eligibleTicketTotal: null,
  randomOffset: null,
  drawnAt: null,
  drawnBy: null,
  createdAt,
  updatedAt,
} satisfies Raffle;

export const rewardFixture = {
  id: "camiseta",
  eventId: "devfest-triangulo-2026",
  name: "Camiseta",
  description: "Camiseta oficial do evento.",
  imageUrl: "https://example.com/camiseta.png",
  ticketCost: 10,
  stock: 50,
  redemptionLimit: 1,
  active: true,
  order: 1,
  createdAt,
  updatedAt,
} satisfies Reward;
