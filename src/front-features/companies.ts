import { Company, CompanyInput } from "@/contracts/company";
import { adminApiRequest } from "@/lib/admin-api/client";

const PATH = "/api/v1/companies";
export const getCompaniesAPI = (signal?: AbortSignal) =>
  adminApiRequest<Company[]>(PATH, { signal });
export const readCompanyAPI = (id: string, signal?: AbortSignal) =>
  adminApiRequest<Company>(`${PATH}/${id}`, { signal });
export const createCompanyAPI = (company: CompanyInput) =>
  adminApiRequest<Company>(PATH, { method: "POST", body: company });
export const updateCompanyAPI = (company: CompanyInput) =>
  adminApiRequest<Company>(`${PATH}/${company.id}`, {
    method: "PUT",
    body: company,
  });
export const deleteCompanyAPI = async (id: string) =>
  (await adminApiRequest<{ id: string }>(`${PATH}/${id}`, { method: "DELETE" }))
    .id;
