import { getSponsors } from "back-features/sponsors";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "GET") {
    getSponsors()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((sponsors: any) => {
        response.json(sponsors);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        response.status(500).send(error);
      });
  } else {
    response.status(404);
  }
}
