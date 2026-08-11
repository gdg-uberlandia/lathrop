import Loading from "@/components/admin/loading-overlay";
import { SponsorsForm } from "@/components/admin/sponsors/sponsors-form";
import { useSponsors } from "@/hooks/useSponsors";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddEditSpeakersPage() {
  const { addSponsor, loading } = useSponsors();

  return (
    <>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex w-full items-center gap-2 justify-between">
          <Link
            href="/admin/sponsors"
            className="text-white size-12 bg-devGray-light/40 flex items-center justify-center bg-devBlue-dark border-1 border-white/5 hover:border-1 hover:border-devBlue-dark hover:!text-devBlue-dark rounded-full"
          >
            <ChevronLeft />
          </Link>
          <div className="grow">
            <h1 className="text-xl text-white/80">Cadastro de Patrocinador</h1>
          </div>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:justify-center lg:items-start gap-8">
          <div className="w-full max-w-[900px] mx-auto">
            <SponsorsForm onSubmit={addSponsor} loading={loading} />
          </div>
        </div>
      </div>
    </>
  );
}
