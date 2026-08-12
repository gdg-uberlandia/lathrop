import {
  AdminEmptyState,
  AdminErrorState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { SpeakersForm } from "@/components/admin/speakers/speakers-form";
import { Speaker } from "@/contracts/speaker";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditSpeakerPage() {
  const router = useRouter();
  const { error, loading, fetchSpeaker, updateSpeaker } = useSpeakers();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  useEffect(() => {
    if (typeof router.query.speakerId === "string")
      void fetchSpeaker(router.query.speakerId).then(setSpeaker);
  }, [fetchSpeaker, router.query.speakerId]);
  return (
    <AdminFormPage
      title="Editar palestrante"
      description="Atualize as informações públicas e profissionais."
      backHref="/admin/speakers"
      backLabel="Voltar para palestrantes"
    >
      {error && <AdminErrorState message={error} />}
      {!speaker && loading ? (
        <AdminLoadingState />
      ) : !speaker ? (
        <AdminEmptyState
          title="Palestrante não encontrado"
          description="O registro pode ter sido removido ou o endereço está incorreto."
        />
      ) : (
        <SpeakersForm
          speaker={speaker}
          editing
          loading={loading}
          onSubmit={async (input) => {
            const updated = await updateSpeaker(input);
            if (updated) await router.push("/admin/speakers");
          }}
        />
      )}
    </AdminFormPage>
  );
}
