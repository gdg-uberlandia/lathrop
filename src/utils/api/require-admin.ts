import type admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

import { hasAdminRole } from "@/back-features/admin-authorization";
import { requireAuth } from "@/utils/api/require-auth";
import { requireAdminWith } from "@/utils/api/require-admin-core";

export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<admin.auth.DecodedIdToken | null> {
  return requireAdminWith(req, res, { requireAuth, hasAdminRole });
}
