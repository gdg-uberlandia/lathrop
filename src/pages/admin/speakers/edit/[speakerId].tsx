import Loading from "@/components/admin/loading-overlay";
import { SpeakersForm } from "@/components/admin/speakers/speakers-form";
import { useSpeakers } from "@/hooks/useSpeakers";
import { Speaker } from "@/models/speaker";
import AdminLayout from "@/layouts/admin-layout";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditSpeakerPage() {
  const router = useRouter();
  const { error, loading, fetchSpeaker, updateSpeaker } = useSpeakers();
  const { speakerId } = router.query;
  const [speaker, setSpeaker] = useState<Speaker | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (speakerId) {
        const data = await fetchSpeaker(String(speakerId));
        setSpeaker(data);
      }
    };
    fetchData();
  }, [speakerId, fetchSpeaker]);

  return (
    <AdminLayout>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex w-full items-center gap-2 justify-between">
          <Link
            href="/admin/speakers"
            className="text-white size-12 bg-devGray-light/40 flex items-center justify-center bg-devBlue-dark border-1 border-white/5 hover:border-1 hover:border-devBlue-dark hover:!text-devBlue-dark rounded-full"
          >
            <ChevronLeft />
          </Link>
          <div className="grow">
            <h1 className="text-xl text-white/80">Edição de Palestrante</h1>
          </div>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:justify-center lg:items-start gap-8">
          <div className="w-full max-w-[900px] mx-auto">
            {error && (
              <p role="alert" className="mb-4 text-devRed">
                {error}
              </p>
            )}
            {!speaker && !loading ? (
              <h2>Palestrante não encontrado</h2>
            ) : (
              speaker && (
                <div>
                  <SpeakersForm
                    onSubmit={async (input) => {
                      const updatedSpeaker = await updateSpeaker(input);
                      if (updatedSpeaker) await router.push("/admin/speakers");
                    }}
                    loading={loading}
                    speaker={speaker}
                    editing
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
