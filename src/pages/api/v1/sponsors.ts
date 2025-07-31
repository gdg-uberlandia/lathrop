import { getSponsors } from "back-features/sponsors";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "GET") {
    getSponsors()
      .then((sponsors: any) => {
        response.json(sponsors);
      })
      .catch((error: any) => {
        response.status(500).send(error);
      });
  } else {
    response.status(404);
  }
}
