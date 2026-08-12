import {
  AdminEmptyState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { SponsorsForm } from "@/components/admin/sponsors/sponsors-form";
import { useSponsors } from "@/hooks/useSponsors";
import { Sponsor } from "@/models/sponsor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditSponsorPage() {
  const router = useRouter();
  const { loading, fetchSponsor, updateSponsor } = useSponsors();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const sponsorId =
    typeof router.query.id === "string" ? router.query.id : null;
  const sponsorLevel =
    typeof router.query.sponsorLevel === "string"
      ? router.query.sponsorLevel
      : null;
  useEffect(() => {
    if (sponsorId && sponsorLevel)
      void fetchSponsor({ sponsorId, sponsorLevel }).then(setSponsor);
  }, [fetchSponsor, sponsorId, sponsorLevel]);
  return (
    <AdminFormPage
      title="Editar patrocinador"
      description="Atualize a marca apoiadora e seu nível de participação."
      backHref="/admin/sponsors"
      backLabel="Voltar para patrocinadores"
    >
      {!sponsor && loading ? (
        <AdminLoadingState />
      ) : !sponsor ? (
        <AdminEmptyState
          title="Patrocinador não encontrado"
          description="O registro pode ter sido removido ou o endereço está incorreto."
        />
      ) : (
        <SponsorsForm
          sponsor={sponsor}
          editing
          loading={loading}
          onSubmit={updateSponsor}
        />
      )}
    </AdminFormPage>
  );
}
