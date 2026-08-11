import Loading from "@/components/admin/loading-overlay";
import { MissionsForm } from "@/components/admin/missions/missions-form";
import { useMissions } from "@/hooks/useMissions";
import AdminLayout from "@/layouts/admin-layout";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AddEditMissionsPage() {
  const { addMission, loading } = useMissions();
  const router = useRouter();

  const handleCreateMission = async (
    mission: Parameters<typeof addMission>[0],
  ) => {
    const result = await addMission(mission);
    if (result) await router.push("/admin/missions");
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
            <h1 className="text-xl text-white/80">Cadastro de Missão</h1>
          </div>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:justify-center lg:items-start gap-8">
          <div className="w-full max-w-[900px] mx-auto">
            <MissionsForm onSubmit={handleCreateMission} loading={loading} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
