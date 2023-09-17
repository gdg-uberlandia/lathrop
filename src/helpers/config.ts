
export type systemValue = 'gdg' | 'iwd' | 'devfest-cerrado' | string;

export interface ConfigValues {
  name: string,
  eventDate: Date,
  eventLinkRegistrationUrl: string,
  place: string,
  placeCity: string,
  formattedDate: string,
  email: 'gdg.uberlandia@gmail.com',
  organizedBy: systemValue
}


const configValues = {
  name: 'IO Extended Brasil 2023',
  eventDate: '2023-07-15T08:00:00',
  eventLinkRegistrationUrl: 'https://www.sympla.com.br/evento-online/io-extended-brasil-2023/2026630',
  place: '',
  placeCity: '',
  formattedDate: '15 Julho',
  email: 'gdg.uberlandia@gmail.com',
  organizedBy: 'gdg' // options 
}

const resolveURL = () => {
  let finalUrl = '';
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    finalUrl = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    finalUrl += `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  } else {
    finalUrl += `https://ioextendedbrasil.devfest.com.br`
  }


  return finalUrl;

}


export const server = resolveURL();

export default configValues;
