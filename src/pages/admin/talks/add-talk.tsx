import { AdminErrorState, AdminFormPage } from "@/components/admin/admin-page";
import { TalksForm } from "@/components/admin/talks/talks-form";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useTalks } from "@/hooks/useTalks";
import { useRouter } from "next/router";

export default function AddTalkPage() {
  const router = useRouter();
  const { error: speakersError, speakers } = useSpeakers();
  const { addTalk, error, loading } = useTalks();
  return (
    <AdminFormPage
      title="Cadastrar palestra"
      description="Defina conteúdo, formato, avaliação e palestrantes responsáveis."
      backHref="/admin/talks"
      backLabel="Voltar para palestras"
    >
      {(error || speakersError) && (
        <AdminErrorState message={(error || speakersError)!} />
      )}
      {speakers.length === 0 && (
        <div className="mb-4 rounded-lg border !border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Cadastre pelo menos um palestrante antes de criar uma palestra.
        </div>
      )}
      <TalksForm
        speakers={speakers}
        loading={loading}
        onSubmit={async (data) => {
          const talk = await addTalk(data);
          if (talk) await router.push("/admin/talks");
        }}
      />
    </AdminFormPage>
  );
}
