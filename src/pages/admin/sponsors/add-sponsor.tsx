import { AdminFormPage } from "@/components/admin/admin-page";
import { SponsorsForm } from "@/components/admin/sponsors/sponsors-form";
import { useSponsors } from "@/hooks/useSponsors";

export default function AddSponsorPage() {
  const { addSponsor, loading } = useSponsors();
  return (
    <AdminFormPage
      title="Cadastrar patrocinador"
      description="Adicione a marca apoiadora e defina seu nível de participação."
      backHref="/admin/sponsors"
      backLabel="Voltar para patrocinadores"
    >
      <SponsorsForm onSubmit={addSponsor} loading={loading} />
    </AdminFormPage>
  );
}
