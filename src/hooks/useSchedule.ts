import { useCallback, useEffect, useState } from "react";
import { getSchedule } from "../front-features/schedule";
import { Schedule } from "@/models/schedule";

export function useSchedule() {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      console.log("mamata");

      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = await getSchedule();
      setSchedule(data);
    } catch (error) {
      console.error(error);
      setError("Erro ao buscar programação");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!schedule.length) fetchSchedule();
  }, [fetchSchedule, schedule?.length]);

  return {
    fetchSchedule,
    schedule,
    error,
    loading,
  };
}
