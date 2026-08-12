import { AdminFormPage } from "@/components/admin/admin-page";
import { SpeakersForm } from "@/components/admin/speakers/speakers-form";
import { useSpeakers } from "@/hooks/useSpeakers";
import { resolveAdminReturnTo } from "@/lib/admin-return-path";
import { useRouter } from "next/router";

export default function AddSpeakerPage() {
  const router = useRouter();
  const returnTo = resolveAdminReturnTo(
    router.query.returnTo,
    "/admin/speakers",
  );
  const { addSpeaker, loading } = useSpeakers();
  return (
    <AdminFormPage
      title="Cadastrar palestrante"
      description="Adicione as informações públicas, profissionais e de contato."
      backHref={returnTo}
      backLabel="Voltar para palestrantes"
    >
      <SpeakersForm onSubmit={addSpeaker} loading={loading} />
    </AdminFormPage>
  );
}
