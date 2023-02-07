const configValues = {
  name: 'IWD Uberlândia 2023',
  eventDate: '2023-03-25T08:00:00',
  eventLinkRegistrationUrl: 'https://doity.com.br/iwd-uberlandia',
  place: '',
  placeCity: 'Uberlândia',
  formattedDate: '25 Março',
  email: 'gdg.uberlandia@gmail.com',
}

const resolveURL = () => {
  let finalUrl = '';
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    finalUrl = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    finalUrl += `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  return finalUrl;

}


export const server = resolveURL();

export default configValues;
