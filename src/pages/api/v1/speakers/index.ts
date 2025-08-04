import { createSpeaker, getSpeakers } from "back-features/speakers";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "GET") {
    getSpeakers()
      .then((speakers) => {
        response.json(speakers);
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
