import { AdminFormPage } from "@/components/admin/admin-page";
import { CompanyForm } from "@/components/admin/companies/company-form";
import { useCompanies } from "@/hooks/useCompanies";
import { useRouter } from "next/router";

export default function AddCompanyPage() {
  const router = useRouter();
  const { addCompany, loading } = useCompanies();
  return (
    <AdminFormPage
      title="Cadastrar empresa"
      description="Adicione uma empresa participante das missões."
      backHref="/admin/companies"
      backLabel="Voltar para empresas"
    >
      <CompanyForm
        loading={loading}
        onSubmit={async (value) => {
          const result = await addCompany(value);
          if (result) await router.push("/admin/companies");
        }}
      />
    </AdminFormPage>
  );
}
