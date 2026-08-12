import {
  AdminEmptyState,
  AdminErrorState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { TalksForm } from "@/components/admin/talks/talks-form";
import { Talk } from "@/contracts/talk";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useTalks } from "@/hooks/useTalks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditTalkPage() {
  const router = useRouter();
  const { error: speakersError, speakers } = useSpeakers();
  const { error, fetchTalk, updateTalk, loading } = useTalks();
  const [talk, setTalk] = useState<Talk | null>(null);
  useEffect(() => {
    if (typeof router.query.talkId === "string")
      void fetchTalk(router.query.talkId).then(setTalk);
  }, [fetchTalk, router.query.talkId]);
  return (
    <AdminFormPage
      title="Editar palestra"
      description="Atualize conteúdo, formato, avaliação e responsáveis."
      backHref="/admin/talks"
      backLabel="Voltar para palestras"
    >
      {(error || speakersError) && (
        <AdminErrorState message={(error || speakersError)!} />
      )}
      {!talk && loading ? (
        <AdminLoadingState />
      ) : !talk ? (
        <AdminEmptyState
          title="Palestra não encontrada"
          description="O registro pode ter sido removido ou o endereço está incorreto."
        />
      ) : (
        <TalksForm
          talk={talk}
          speakers={speakers}
          loading={loading}
          onSubmit={async (data) => {
            const updated = await updateTalk(data);
            if (updated) await router.push("/admin/talks");
          }}
        />
      )}
    </AdminFormPage>
  );
}
