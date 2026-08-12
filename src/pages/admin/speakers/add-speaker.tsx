import { AdminFormPage } from "@/components/admin/admin-page";
import { SpeakersForm } from "@/components/admin/speakers/speakers-form";
import { useSpeakers } from "@/hooks/useSpeakers";

export default function AddSpeakerPage() {
  const { addSpeaker, loading } = useSpeakers();
  return (
    <AdminFormPage
      title="Cadastrar palestrante"
      description="Adicione as informações públicas, profissionais e de contato."
      backHref="/admin/speakers"
      backLabel="Voltar para palestrantes"
    >
      <SpeakersForm onSubmit={addSpeaker} loading={loading} />
    </AdminFormPage>
  );
}
