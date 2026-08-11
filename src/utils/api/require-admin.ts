import type admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

import { hasAdminRole } from "@/back-features/admin-authorization";
import { requireAuth } from "@/utils/api/require-auth";

export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<admin.auth.DecodedIdToken | null> {
  const user = await requireAuth(req, res);
  if (!user) return null;

  if (!(await hasAdminRole(user.uid))) {
    res.status(403).json({ error: "Acesso restrito a administradores" });
    return null;
  }

  return user;
}
