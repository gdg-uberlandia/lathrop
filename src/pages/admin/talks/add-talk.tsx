import Loading from "@/components/admin/loading-overlay";
import { TalksForm } from "@/components/admin/talks/talks-form";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useTalks } from "@/hooks/useTalks";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AddTalkPage() {
  const router = useRouter();
  const { error: speakersError, speakers } = useSpeakers();
  const { addTalk, error, loading } = useTalks();
  return (
    <>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/talks"
            className="flex size-12 items-center justify-center rounded-full bg-devBlue-dark text-white"
          >
            <ChevronLeft />
          </Link>
          <h1 className="text-xl text-white/80">Cadastro de palestra</h1>
        </div>
        <div className="mx-auto mt-12 max-w-[900px]">
          {(error || speakersError) && (
            <p role="alert" className="mb-4 text-devRed">
              {error || speakersError}
            </p>
          )}
          {speakers.length === 0 && (
            <p className="mb-4">
              Cadastre pelo menos um palestrante antes de criar uma palestra.
            </p>
          )}
          <TalksForm
            speakers={speakers}
            loading={loading}
            onSubmit={async (data) => {
              const talk = await addTalk(data);
              if (talk) await router.push("/admin/talks");
            }}
          />
        </div>
      </div>
    </>
  );
}
