import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  createCompanyAPI,
  deleteCompanyAPI,
  getCompaniesAPI,
  readCompanyAPI,
  updateCompanyAPI,
} from "@/front-features/companies";
import { adminQueryKeys, resolveAdminAction } from "@/lib/admin-query";
import { getAdminApiErrorMessage } from "@/lib/admin-api/errors";
import type { Company, CompanyInput } from "@/contracts/company";

export function useCompanies() {
  const { isAdmin } = useAuth();
  const client = useQueryClient();
  const query = useQuery({
    enabled: isAdmin,
    queryKey: adminQueryKeys.companies,
    queryFn: ({ signal }) => getCompaniesAPI(signal),
  });
  const updateCache = (company: Company) =>
    client.setQueryData<Company[]>(adminQueryKeys.companies, (current) =>
      [
        ...(current ?? []).filter((item) => item.id !== company.id),
        company,
      ].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    );
  const create = useMutation({
    mutationFn: createCompanyAPI,
    onSuccess: updateCache,
  });
  const update = useMutation({
    mutationFn: updateCompanyAPI,
    onSuccess: updateCache,
  });
  const remove = useMutation({
    mutationFn: deleteCompanyAPI,
    onSuccess: (id) =>
      client.setQueryData<Company[]>(adminQueryKeys.companies, (current) =>
        current?.filter((item) => item.id !== id),
      ),
  });
  const error = query.error || create.error || update.error || remove.error;
  return {
    companies: query.data ?? [],
    loading:
      query.isFetching ||
      create.isPending ||
      update.isPending ||
      remove.isPending,
    error: error
      ? getAdminApiErrorMessage(error, "Erro ao processar empresas")
      : null,
    fetchCompanies: query.refetch,
    fetchCompany: (id: string) =>
      resolveAdminAction(() =>
        client.fetchQuery({
          queryKey: [...adminQueryKeys.companies, id],
          queryFn: ({ signal }) => readCompanyAPI(id, signal),
        }),
      ),
    addCompany: (value: CompanyInput) =>
      resolveAdminAction(() => create.mutateAsync(value)),
    updateCompany: (value: CompanyInput) =>
      resolveAdminAction(() => update.mutateAsync(value)),
    removeCompany: (id: string) =>
      resolveAdminAction(() => remove.mutateAsync(id)),
  };
}
