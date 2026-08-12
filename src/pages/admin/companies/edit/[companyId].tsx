import {
  AdminEmptyState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { CompanyForm } from "@/components/admin/companies/company-form";
import { Company } from "@/contracts/company";
import { useCompanies } from "@/hooks/useCompanies";
import { resolveAdminReturnTo } from "@/lib/admin-return-path";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditCompanyPage() {
  const router = useRouter();
  const returnTo = resolveAdminReturnTo(
    router.query.returnTo,
    "/admin/companies",
  );
  const { fetchCompany, updateCompany, loading } = useCompanies();
  const [company, setCompany] = useState<Company | null>(null);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    if (typeof router.query.companyId !== "string") return;
    setResolved(false);
    void fetchCompany(router.query.companyId)
      .then(setCompany)
      .finally(() => setResolved(true));
  }, [fetchCompany, router.query.companyId]);
  return (
    <AdminFormPage
      title="Editar empresa"
      description="Atualize os dados da empresa participante."
      backHref={returnTo}
      backLabel="Voltar para empresas"
    >
      {!resolved ? (
        <AdminLoadingState />
      ) : !company ? (
        <AdminEmptyState
          title="Empresa não encontrada"
          description="O registro pode ter sido removido."
        />
      ) : (
        <CompanyForm
          company={company}
          loading={loading}
          onSubmit={async (value) => {
            const result = await updateCompany(value);
            if (result) await router.push(returnTo);
          }}
        />
      )}
    </AdminFormPage>
  );
}
