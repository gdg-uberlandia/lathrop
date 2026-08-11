import Loading from "@/components/admin/loading-overlay";
import { TalksForm } from "@/components/admin/talks/talks-form";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useTalks } from "@/hooks/useTalks";
import { Talk } from "@/models/talk";
import AdminLayout from "@/layouts/admin-layout";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
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
    <AdminLayout>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/talks"
            className="flex size-12 items-center justify-center rounded-full bg-devBlue-dark text-white"
          >
            <ChevronLeft />
          </Link>
          <h1 className="text-xl text-white/80">Edição de palestra</h1>
        </div>
        <div className="mx-auto mt-12 max-w-[900px]">
          {(error || speakersError) && (
            <p role="alert" className="mb-4 text-devRed">
              {error || speakersError}
            </p>
          )}
          {talk && (
            <TalksForm
              talk={talk}
              speakers={speakers}
              loading={loading}
              onSubmit={async (data) => {
                const updatedTalk = await updateTalk(data);
                if (updatedTalk) await router.push("/admin/talks");
              }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
