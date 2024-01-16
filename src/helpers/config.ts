
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
  name: 'IWD Uberlândia 2024',
  eventDate: '2024-03-15T08:00:00',
  eventLinkRegistrationUrl: 'https://doity.com.br/devfesttriangulo',
  place: 'A definir',
  placeAddress: 'A definir',
  placeCity: 'Uberlândia - MG',
  formattedDate: 'A definir',
  email: 'gdg.uberlandia@gmail.com',
  organizedBy: 'wtm', // options
  midiaKit: '',
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
