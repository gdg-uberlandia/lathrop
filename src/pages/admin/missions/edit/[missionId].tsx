import {
  AdminEmptyState,
  AdminFormPage,
  AdminLoadingState,
} from "@/components/admin/admin-page";
import { MissionsForm } from "@/components/admin/missions/missions-form";
import { useMissions } from "@/hooks/useMissions";
import { Mission, MissionInput } from "@/models/mission";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditMissionPage() {
  const router = useRouter();
  const { loading, fetchMission, updateMission } = useMissions();
  const [mission, setMission] = useState<Mission | null>(null);
  useEffect(() => {
    if (typeof router.query.missionId === "string")
      void fetchMission(router.query.missionId).then(setMission);
  }, [fetchMission, router.query.missionId]);
  const update = async (data: MissionInput) => {
    const result = await updateMission(data);
    if (result) await router.push("/admin/missions");
    return result;
  };
  return (
    <AdminFormPage
      title="Editar missão"
      description="Atualize regras, recompensa e disponibilidade da missão."
      backHref="/admin/missions"
      backLabel="Voltar para missões"
    >
      {!mission && loading ? (
        <AdminLoadingState />
      ) : !mission ? (
        <AdminEmptyState
          title="Missão não encontrada"
          description="O registro pode ter sido removido ou o endereço está incorreto."
        />
      ) : (
        <MissionsForm
          mission={mission}
          editing
          loading={loading}
          onSubmit={update}
        />
      )}
    </AdminFormPage>
  );
}
