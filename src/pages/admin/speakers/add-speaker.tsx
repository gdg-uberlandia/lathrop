import { Button } from "@/assets/components/ui/button";
import { Speaker } from "@/contracts/speaker";
import Link from "next/link";
import { useState } from "react";
import { AdminErrorState, AdminFormPage } from "@/components/admin/admin-page";
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
  const { addSpeaker, loading, error } = useSpeakers();
  const [createdSpeaker, setCreatedSpeaker] = useState<Speaker | null>(null);
  return (
    <AdminFormPage
      title="Cadastrar palestrante"
      description="Adicione as informações públicas, profissionais e de contato."
      backHref={returnTo}
      backLabel="Voltar para palestrantes"
    >
      {createdSpeaker ? (
        <section
          className="rounded-xl border bg-white p-6"
          aria-labelledby="speaker-created-title"
        >
          <h2
            id="speaker-created-title"
            tabIndex={-1}
            ref={(element) => element?.focus()}
            className="text-lg font-semibold text-slate-900"
          >
            Palestrante cadastrado com sucesso
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {createdSpeaker.name} foi cadastrado. O que deseja fazer agora?
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="admin-primary-action !bg-blue-600">
              <Link
                href={{
                  pathname: "/admin/talks/add-talk",
                  query: { speakerId: createdSpeaker.id },
                }}
              >
                Cadastrar palestra para este palestrante
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setCreatedSpeaker(null)}>
              Cadastrar novo palestrante
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/speakers">
                Voltar para a listagem de palestrantes
              </Link>
            </Button>
          </div>
        </section>
      ) : (
        <>
          {error && <AdminErrorState message={error} />}
          <SpeakersForm
            loading={loading}
            onSubmit={async (data) => {
              const speaker = await addSpeaker(data);
              if (speaker) setCreatedSpeaker(speaker);
              return speaker;
            }}
          />
        </>
      )}
    </AdminFormPage>
  );
}
