import Loading from "@/components/admin/loading-overlay";
import { useSponsors } from "@/hooks/useSponsors";
import AdminLayout from "layouts/admin-layout";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SponsorForm } from "@/components/admin/sponsors/add-sponsor-form";
import { SponsorsrFormValues } from "@/components/admin/sponsors/add-sponsor-form-schema";
import { useSearchParams } from "next/navigation";

export default function EditSpeakerPage() {
  const router = useRouter();
  const { loading, fetchSponsor, updateSponsor } = useSponsors();
  const { sponsorLevel } = router.query;
  const searchParams = useSearchParams();
  const sponsorId = searchParams.get("id");

  const [sponsor, setSponsor] = useState<SponsorsrFormValues | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (sponsorId && sponsorLevel) {
        const data = await fetchSponsor({
          sponsorId,
          sponsorLevel: String(sponsorLevel),
        });
        setSponsor(data);
      }
    };
    fetchData();
  }, [sponsorId, sponsorLevel, fetchSponsor]);

  return (
    <AdminLayout>
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
            <h1 className="text-xl text-white/80">Edição de Patrocinador</h1>
          </div>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:justify-center lg:items-start gap-8">
          <div className="w-full max-w-[900px] mx-auto">
            {!sponsor && !loading ? (
              <h2>Patrocinador não encontrado</h2>
            ) : (
              sponsor && (
                <div>
                  <SponsorForm
                    onSubmitForm={updateSponsor}
                    loading={loading}
                    sponsor={sponsor}
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
