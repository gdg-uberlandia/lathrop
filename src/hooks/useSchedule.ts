import { Schedule } from "@/models/schedule";
import { useCallback, useEffect, useState } from "react";
import {
  createScheduleAPI,
  deleteScheduleAPI,
  getScheduleAPI,
  readScheduleAPI,
  updateScheduleAPI,
} from "../front-features/schedule";

export function useSchedule() {
  const [error, setError] = useState<string | null>();
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      let data = await getScheduleAPI();
      data = data.sort((a, b) => a.end.localeCompare(b.end));
      setSchedule(data);
    } catch (error) {
      console.error(error);
      setError("Erro ao buscar programação");
    } finally {
      setLoading(false);
    }
  }, []);

  const createSchedule = async (schedule: Schedule) => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newSchedule = await createScheduleAPI(schedule);
      setSchedule((prev) => [...prev, newSchedule]);
      return newSchedule as Schedule;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const readSchedule = useCallback(async (scheduleId: string) => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const schedule = await readScheduleAPI(scheduleId);
      return schedule;
    } catch (error) {
      console.error(error);
      setError("Erro ao buscar speaker específico");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSchedule = async (schedule: any) => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedSchedule = await updateScheduleAPI(schedule);
      setSchedule((prev) =>
        prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s)),
      );
    } catch (error) {
      console.error(error);
      setError("Erro ao atualizar cronograma");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      setLoading(true);
      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      await deleteScheduleAPI(scheduleId);
      setSchedule((prev) => prev.filter((item) => item.id !== scheduleId));
    } catch (error) {
      console.error(error);
      setError("Erro ao deletar schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!schedule.length) fetchSchedule();
  }, [fetchSchedule, schedule?.length]);

  return {
    createSchedule,
    readSchedule,
    updateSchedule,
    deleteSchedule,
    fetchSchedule,
    schedule,
    error,
    loading,
  };
}
