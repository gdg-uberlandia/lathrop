export type systemValue =
  | "gdg"
  | "iwd"
  | "devfest-cerrado"
  | "devfest-triangulo"
  | string;

export interface ConfigValues {
  name: string;
  eventDate: Date;
  eventLinkRegistrationUrl: string;
  place: string;
  placeCity: string;
  formattedDate: string;
  email: "gdg.uberlandia@gmail.com";
  organizedBy: systemValue;
  midiaKit?: string;
  socialMedia?: {
    instagram: string;
  };
}

const configValues = {
  name: "Devfest Triângulo 2025",
  eventDate: "2025-11-22T08:00:00",
  eventLinkRegistrationUrl: "https://doity.com.br/devfest-triangulo-2025",
  eventLinkSponsorshipUrl:
    "https://www.canva.com/design/DAGqnTRLIRo/py54Ke6aC5yqYyJXZ8X00A/edit",
  place: "Gaudium Hall",
  placeAddress: "R. Anita, 25 Altamira, Uberlândia - MG 38411-122",
  placeCity: "Uberlândia - MG",
  formattedDate: "22 Novembro",
  email: "gdg.uberlandia@gmail.com",
  organizedBy: "gdg", // options
  midiaKit:
    "https://www.canva.com/design/DAGqnTRLIRo/py54Ke6aC5yqYyJXZ8X00A/edit",
  socialMedia: {
    instagram: "https://www.instagram.com/devfesttriangulo",
  },
};

const resolveURL = () => {
  let finalUrl = "";
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    finalUrl = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    finalUrl += `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  } else {
    finalUrl += `https://devfesttriangulo.com.br`;
  }

  return finalUrl;
};

export const server = resolveURL();

export default configValues;
