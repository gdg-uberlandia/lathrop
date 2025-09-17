import { useEffect, useState, useCallback } from "react";
import { Speaker } from "models/speaker";
import {
  getSpeakers,
  fetchSpeakerAPI,
  createSpeakerAPI,
  deleteSpeakerAPI,
  updateSpeakerAPI,
} from "../front-features/speakers";

export function useSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpeakers = useCallback(async () => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const data = await getSpeakers();
      setSpeakers(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar speakers");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSpeaker = useCallback(async (speakerId: string) => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const speaker = await fetchSpeakerAPI(speakerId);
      return speaker;
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar speaker específico");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addSpeaker = async (speaker: any) => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newSpeaker = await createSpeakerAPI({
        ...speaker,
        canBeEvaluated: false,
      });
      setSpeakers((prev) => [...prev, newSpeaker]);
      return newSpeaker as Speaker;
    } catch (err) {
      console.error(err);
      setError("Erro ao criar speaker");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeSpeaker = async (key: string) => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      await deleteSpeakerAPI(key);
      setSpeakers((prev) => prev.filter((s) => s.key !== key));
    } catch (err) {
      console.error(err);
      setError("Erro ao deletar speaker");
    } finally {
      setLoading(false);
    }
  };

  const updateSpeaker = async (speaker: any) => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedSpeaker = await updateSpeakerAPI(speaker);
      setSpeakers((prev) =>
        prev.map((s) => (s.key === updatedSpeaker.key ? updatedSpeaker : s)),
      );
      return updatedSpeaker as Speaker;
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar speaker");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!speakers.length) fetchSpeakers();
  }, [fetchSpeakers, speakers.length]);

  return {
    speakers,
    loading,
    error,
    fetchSpeakers,
    fetchSpeaker,
    addSpeaker,
    removeSpeaker,
    updateSpeaker,
  };
}
