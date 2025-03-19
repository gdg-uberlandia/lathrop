
export type systemValue = 'gdg' | 'iwd' | 'devfest-cerrado' | 'devfest-triangulo' | string;

export interface ConfigValues {
  name: string,
  eventDate: Date,
  eventLinkRegistrationUrl: string,
  place: string,
  placeCity: string,
  formattedDate: string,
  email: 'gdg.uberlandia@gmail.com',
  organizedBy: systemValue
  midiaKit?: string
  socialMedia?: {
    instagram: string;
  }
}


const configValues = {
  name: 'IWD Uberlândia 2025',
  eventDate: '2025-04-12T08:00:00',
  eventLinkRegistrationUrl: 'https://doity.com.br/iwd-uberlandia-2025',
  place: 'CDL Uberlândia',
  placeAddress: 'Av. Belo Horizonte, 1290 - Osvaldo Rezende',
  placeCity: 'Uberlândia - MG',
  formattedDate: '12 de Abril',
  email: 'gdg.uberlandia@gmail.com',
  organizedBy: 'wtm', // options
  midiaKit: 'https://docs.google.com/presentation/d/1nyyCyA1RJ37lAjCbLB9UH60pgkGZUONLNAtljmkzR68/edit#slide=id.g26157c686c7_0_239',
  socialMedia: {
    instagram: 'https://www.instagram.com/wtmuberlandia/'
  }
}

const resolveURL = () => {
  let finalUrl = '';
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    finalUrl = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    finalUrl += `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  } else {
    finalUrl += `https://wtmuberlandia.com.br`
  }


  return finalUrl;

}


export const server = resolveURL();

export default configValues;
