import type { DecodedIdToken } from "firebase-admin/auth";
import type { NextApiRequest, NextApiResponse } from "next";

import { auth } from "@/utils/db";

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<DecodedIdToken | null> {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Autenticação necessária" });
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({ error: "Autenticação necessária" });
    return null;
  }

  try {
    return await auth.verifyIdToken(token, true);
  } catch {
    res.status(401).json({ error: "Sessão inválida ou expirada" });
    return null;
  }
}
