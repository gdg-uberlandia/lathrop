import type { NextApiRequest, NextApiResponse } from "next";
import {
  deleteCompany,
  getCompanyById,
  updateCompany,
} from "@/back-features/companies";
import { requireAdmin } from "@/utils/api/require-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!(await requireAdmin(req, res))) return;
  const companyId =
    typeof req.query.companyId === "string" ? req.query.companyId : "";
  if (!companyId)
    return res.status(400).json({ error: "companyId não informado." });
  try {
    if (req.method === "GET")
      return res.status(200).json(await getCompanyById(companyId));
    if (req.method === "PUT")
      return res
        .status(200)
        .json(await updateCompany({ ...req.body, id: companyId }));
    if (req.method === "DELETE")
      return res.status(200).json({ id: await deleteCompany(companyId) });
    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Operação inválida",
    });
  }
}
