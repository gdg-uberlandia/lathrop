import {
  AdminEmptyState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { CompanyForm } from "@/components/admin/companies/company-form";
import { Company } from "@/contracts/company";
import { useCompanies } from "@/hooks/useCompanies";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditCompanyPage() {
  const router = useRouter();
  const { fetchCompany, updateCompany, loading } = useCompanies();
  const [company, setCompany] = useState<Company | null>(null);
  useEffect(() => {
    if (typeof router.query.companyId === "string")
      void fetchCompany(router.query.companyId).then(setCompany);
  }, [fetchCompany, router.query.companyId]);
  return (
    <AdminFormPage
      title="Editar company"
      description="Atualize os dados da empresa participante."
      backHref="/admin/companies"
      backLabel="Voltar para companies"
    >
      {!company && loading ? (
        <AdminLoadingState />
      ) : !company ? (
        <AdminEmptyState
          title="Company não encontrada"
          description="O registro pode ter sido removido."
        />
      ) : (
        <CompanyForm
          company={company}
          loading={loading}
          onSubmit={async (value) => {
            const result = await updateCompany(value);
            if (result) await router.push("/admin/companies");
          }}
        />
      )}
    </AdminFormPage>
  );
}
