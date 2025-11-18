import { Mission } from "@/models/mission";
import { useCallback, useEffect, useState } from "react";
import {
  createMissionAPI,
  deleteMissionAPI,
  getMissionsAPI,
  readMissionAPI,
  updateMissionAPI,
} from "front-features/missions";

export function useMissions() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);

  const fetchMissions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMissionsAPI();
      setMissions(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar missoes");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMission = useCallback(async (missionId: string) => {
    try {
      setLoading(true);
      const mission = await readMissionAPI({ missionId });
      return mission;
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar missao específico");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addMission = async (mission: Mission) => {
    try {
      setLoading(true);
      const newMission = await createMissionAPI(mission);
      setMissions((prev) => [...prev, newMission]);
      return newMission as Mission;
    } catch (err) {
      console.error(err);
      setError("Erro ao criar missao");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeMissao = async (missionId: string) => {
    try {
      setLoading(true);
      await deleteMissionAPI(missionId);
      setMissions((prev) => prev.filter((s) => s.id !== missionId));
    } catch (error) {
      console.error(error);
      setError("Erro ao deletar Missao");
    } finally {
      setLoading(false);
    }
  };

  const updateMission = async (mission: Mission) => {
    try {
      setLoading(true);
      const updatedMission = await updateMissionAPI(mission);
      setMissions((prev) =>
        prev.map((m) => (m.id === mission.id ? updatedMission : m)),
      );
      return updatedMission;
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar missão");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!missions.length) fetchMissions();
  }, [fetchMissions, missions.length]);

  return {
    missions,
    loading,
    error,
    fetchMissions,
    fetchMission,
    addMission,
    removeMissao,
    updateMission,
  };
}
