import { useEffect, useState } from "react";
import { Speaker } from "models/speaker";
import {
  getSpeakers,
  createSpeakerAPI,
  deleteSpeakerAPI,
  updateSpeakerAPI,
} from "../front-features/speakers";

export function useSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(!speakers.length);
  const [error, setError] = useState<string | null>(null);

  const fetchSpeakers = async () => {
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
  };

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

  const updateSpeaker = async ({ speaker }: { speaker: Speaker }) => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedSpeaker = await updateSpeakerAPI(speaker);
      setSpeakers((prev) =>
        prev.map((s) => (s.key === updatedSpeaker.key ? updatedSpeaker : s)),
      );
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar speaker");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!speakers.length) fetchSpeakers();
  }, [speakers]);

  return {
    speakers,
    loading,
    error,
    fetchSpeakers,
    addSpeaker,
    removeSpeaker,
    updateSpeaker,
  };
}
