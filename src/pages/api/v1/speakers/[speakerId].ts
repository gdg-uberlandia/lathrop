import { deleteSpeaker } from "back-features/speakers";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === "DELETE") {
    // Process a POST request

    const { speakerId } = request.query;
    if (!speakerId) {
      response.status(500).send({ error: "Id is blank" });
      return;
    }

    deleteSpeaker(speakerId.toString())
      .then(() => {
        response.status(201);
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  } else {
    response.status(404);
  }
}
