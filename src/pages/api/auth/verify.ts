import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return res.status(200).json({ user: decodedToken });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
