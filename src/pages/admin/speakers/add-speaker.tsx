import AdminLayout from "layouts/admin-layout";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { useSpeakers } from "@/hooks/useSpeakers";
import { SpeakerForm } from "../../../components/admin/speakers/add-speaker-form";
import Loading from "@/components/admin/loading-overlay";

function AddEditSpeakersPage() {
  const { addSpeaker, error, loading } = useSpeakers();

  return (
    <>
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
            <h1 className="text-xl text-white/80">Cadastro de Palestrantes</h1>
          </div>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:justify-center lg:items-start gap-8">
          <div className="w-full max-w-[900px] mx-auto">
            <SpeakerForm
              onSubmit={addSpeaker}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </>
  );
}

AddEditSpeakersPage.layout = AdminLayout;

export default AddEditSpeakersPage;
