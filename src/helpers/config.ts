
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
  name: 'Devfest Triângulo 2023',
  eventDate: '2023-12-02T08:00:00',
  eventLinkRegistrationUrl: 'https://doity.com.br/devfesttriangulo',
  place: '',
  placeCity: 'Uberlândia - MG',
  formattedDate: '02 Dezembro',
  email: 'gdg.uberlandia@gmail.com',
  organizedBy: 'gdg', // options
  midiaKit: 'https://docs.google.com/presentation/d/1gPKzG7xZibF3wAbEA050irl2ijhsAMRKXMispSaFrys/edit#slide=id.g223b3f84614_0_31',
  socialMedia: {
    instagram: 'https://www.instagram.com/devfesttriangulo'
  }
}

const resolveURL = () => {
  let finalUrl = '';
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    finalUrl = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    finalUrl += `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  } else {
    finalUrl += `https://devfesttriangulo.com.br`
  }


  return finalUrl;

}


export const server = resolveURL();

export default configValues;
