const configValues = {
  name: 'IO Extended Brasil',
  eventDate: '2023-07-15T08:00:00',
  eventLinkRegistrationUrl: 'https://www.sympla.com.br/evento-online/io-extended-brasil-2023/2026630',
  place: '',
  placeCity: '',
  formattedDate: '15 Julho',
  email: 'gdg.uberlandia@gmail.com',
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
