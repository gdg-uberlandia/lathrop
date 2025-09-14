import { useEffect, useState } from "react";
import { Speaker } from "models/speaker";
import {
  getSpeakers,
  createSpeakerAPI,
  deleteSpeakerAPI,
} from "../front-features/speakers";

interface UseSpeakersOptions {
  initialData?: Speaker[];
}

export function useSpeakers({ initialData = [] }: UseSpeakersOptions = {}) {
  const [speakers, setSpeakers] = useState<Speaker[]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);
  const [error, setError] = useState<string | null>(null);

  const fetchSpeakers = async () => {
    try {
      setLoading(true);
      const data = await getSpeakers();
      setSpeakers(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar speakers");
    } finally {
      setLoading(false);
    }
  };

  const addSpeaker = async (speaker: any) => {
    try {
      setLoading(true);

      const newSpeaker = await createSpeakerAPI(speaker);

      setSpeakers((prev) => [...prev, newSpeaker]);
    } catch (err) {
      console.error(err);
      setError("Erro ao criar speaker");
    } finally {
      setLoading(false);
    }
  };

  const removeSpeaker = async (key: string) => {
    try {
      setLoading(true);
      await deleteSpeakerAPI(key);
      setSpeakers((prev) => prev.filter((s) => s.key !== key));
    } catch (err) {
      console.error(err);
      setError("Erro ao deletar speaker");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData.length) fetchSpeakers();
  }, [initialData]);

  return { speakers, loading, error, fetchSpeakers, addSpeaker, removeSpeaker };
}
