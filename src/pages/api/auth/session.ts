import { getProfileAccessRoles } from "@/back-features/admin-authorization";
import { requireAuth } from "@/utils/api/require-auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const user = await requireAuth(req, res);
  if (!user) return;

  const accessRoles = await getProfileAccessRoles(user);
  return res.status(200).json({
    user: { uid: user.uid, email: user.email ?? null },
    accessRoles,
    isAdmin: accessRoles.includes("admin"),
  });
}
