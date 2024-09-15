import { createSpeaker, getSpeaker } from "back-features/speakers";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "GET") {
    getSpeaker()
      .then((speaker) => {
        response.json(speaker);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  } else if (request.method === "POST") {
    const {
      key,
      id,
      companyTitle,
      mini_bio,
      name,
      photo,
      tech,
      title,
      topic,
      location,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = request.body as any;
    createSpeaker({
      key,
      id,
      companyTitle,
      mini_bio,
      name,
      photo,
      tech,
      title,
      topic,
      location,
    })
      .then((speaker) => {
        response.json(speaker);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  } else {
    response.status(404);
  }
}
