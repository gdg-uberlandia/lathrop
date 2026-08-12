import {
  AdminEmptyState,
  AdminErrorState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { SpeakersForm } from "@/components/admin/speakers/speakers-form";
import { Speaker } from "@/contracts/speaker";
import { useSpeakers } from "@/hooks/useSpeakers";
import { resolveAdminReturnTo } from "@/lib/admin-return-path";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditSpeakerPage() {
  const router = useRouter();
  const returnTo = resolveAdminReturnTo(
    router.query.returnTo,
    "/admin/speakers",
  );
  const { error, loading, fetchSpeaker, updateSpeaker } = useSpeakers();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [resolved, setResolved] = useState(false);
  useEffect(() => {
    if (typeof router.query.speakerId !== "string") return;
    setResolved(false);
    void fetchSpeaker(router.query.speakerId)
      .then(setSpeaker)
      .finally(() => setResolved(true));
  }, [fetchSpeaker, router.query.speakerId]);
  return (
    <AdminFormPage
      title="Editar palestrante"
      description="Atualize as informações públicas e profissionais."
      backHref={returnTo}
      backLabel="Voltar para palestrantes"
    >
      {error && <AdminErrorState message={error} />}
      {!resolved ? (
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
            if (updated) await router.push(returnTo);
          }}
        />
      )}
    </AdminFormPage>
  );
}
