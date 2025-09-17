import Loading from "@/components/admin/loading-overlay";
import { useSpeakers } from "@/hooks/useSpeakers";
import AdminLayout from "layouts/admin-layout";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Speaker } from "@/models/speaker";
import { SpeakerForm } from "@/components/admin/speakers/add-speaker-form";

export default function EditSpeakerPage() {
  const router = useRouter();
  const { loading, fetchSpeaker, error, updateSpeaker } = useSpeakers();
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
            {!speaker && !loading ? (
              <h2>Palestrante não encontrado</h2>
            ) : (
              speaker && (
                <div>
                  SpeakerId: {speaker.name}
                  <SpeakerForm
                    onSubmit={updateSpeaker}
                    loading={loading}
                    error={error}
                    speaker={speaker}
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
