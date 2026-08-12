import type admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

export type AdminAuthorizationDependencies = {
  requireAuth: (
    req: NextApiRequest,
    res: NextApiResponse,
  ) => Promise<admin.auth.DecodedIdToken | null>;
  hasAdminRole: (user: admin.auth.DecodedIdToken) => Promise<boolean>;
};

export async function requireAdminWith(
  req: NextApiRequest,
  res: NextApiResponse,
  dependencies: AdminAuthorizationDependencies,
): Promise<admin.auth.DecodedIdToken | null> {
  const user = await dependencies.requireAuth(req, res);
  if (!user) return null;
  if (!(await dependencies.hasAdminRole(user))) {
    res.status(403).json({ error: "Acesso restrito a administradores" });
    return null;
  }
  return user;
}
