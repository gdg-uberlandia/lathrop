import Loading from "@/components/admin/loading-overlay";
import { MissionsForm } from "@/components/admin/missions/missions-form";
import { useMissions } from "@/hooks/useMissions";
import { Mission, MissionInput } from "@/models/mission";
import AdminLayout from "@/layouts/admin-layout";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditMissionPage() {
  const router = useRouter();
  const { loading, fetchMission, updateMission } = useMissions();
  const { missionId } = router.query;
  const [mission, setMission] = useState<Mission | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (missionId) {
        const data = await fetchMission(String(missionId));
        setMission(data);
      }
    };
    fetchData();
  }, [missionId, fetchMission]);

  const handleUpdateMission = async (missionData: MissionInput) => {
    const result = await updateMission(missionData);
    if (result) {
      await router.push("/admin/missions");
    }
    return result;
  };

  return (
    <AdminLayout>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex w-full items-center gap-2 justify-between">
          <Link
            href="/admin/missions"
            className="text-white size-12 bg-devGray-light/40 flex items-center justify-center bg-devBlue-dark border-1 border-white/5 hover:border-1 hover:border-devBlue-dark hover:!text-devBlue-dark rounded-full"
          >
            <ChevronLeft />
          </Link>
          <div className="grow">
            <h1 className="text-xl text-white/80">Editar Missão</h1>
          </div>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:justify-center lg:items-start gap-8">
          <div className="w-full max-w-[900px] mx-auto">
            {!mission && !loading ? (
              <h2>Missão não encontrada</h2>
            ) : (
              mission && (
                <div>
                  <MissionsForm
                    onSubmit={handleUpdateMission}
                    loading={loading}
                    mission={mission}
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
