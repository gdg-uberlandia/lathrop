export type systemValue =
  | "gdg"
  | "iwd"
  | "devfest-cerrado"
  | "devfest-triangulo"
  | string;

export interface ConfigValues {
  email: "gdg.uberlandia@gmail.com";
  eventDate: Date;
  eventLinkRegistrationUrl: string;
  formattedDate: string;
  midiaKit?: string;
  name: string;
  organizedBy: systemValue;
  place: string;
  placeCity: string;
  socialMedia?: {
    instagram: string;
    linkedin: string;
  };
}

const configValues = {
  name: "Devfest Triângulo 2025",
  eventDate: "2025-11-22T08:00:00",
  eventStart: "08:00",
  eventEnd: "18:00",
  eventLinkRegistrationUrl: "https://doity.com.br/devfest-triangulo-2025",
  eventLinkSponsorshipUrl:
    "https://wa.me//553491846822?text=Gostaria%20de%20saber%20mais%20sobre%20as%20op%C3%A7%C3%B5es%20de%20patroc%C3%ADnio%20para%20o%20Devfest%20Tri%C3%A2ngulo%202025",
  place: "Gaudium Hall",
  placeAddress: "Rua Anita, 25, Bairro Altamira",
  placeCity: "Uberlândia - MG",
  placeCEP: "CEP 38411-122",
  formattedDate: "22 Novembro",
  email: "gdg.uberlandia@gmail.com",
  organizedBy: "gdg", // options
  midiaKit:
    "https://www.canva.com/design/DAGqnTRLIRo/py54Ke6aC5yqYyJXZ8X00A/edit",
  socialMedia: {
    instagram: "https://www.instagram.com/devfesttriangulo",
    linkedin: "https://www.linkedin.com/company/gdg-uberlandia",
  },
  terms: "",
  codeOfConduct:
    "https://docs.google.com/document/d/16duFqXn39gR0rs2l-YOZ2UbDEUnG96YMD5mVvQZI_MQ/edit?tab=t.0#heading=h.pmwr554r0cy0",
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
