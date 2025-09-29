import { Speaker } from "@/models/speaker";
import { useCallback, useEffect, useState } from "react";
import {
  createSpeakerAPI,
  deleteSpeakerAPI,
  getSpeakersAPI,
  readSpeakerAPI,
  updateSpeakerAPI,
} from "../front-features/speakers";

export function useSpeakers() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  const fetchSpeakers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSpeakersAPI();
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
      const speaker = await readSpeakerAPI(speakerId);
      return speaker;
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar speaker específico");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addSpeaker = async (speaker: Speaker) => {
    try {
      setLoading(true);
      const newSpeaker = await createSpeakerAPI(speaker);
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

  const removeSpeaker = async (speakerId: string) => {
    try {
      setLoading(true);
      await deleteSpeakerAPI(speakerId);
      setSpeakers((prev) => prev.filter((s) => s.id !== speakerId));
    } catch (error) {
      console.error(error);
      setError("Erro ao deletar speaker");
    } finally {
      setLoading(false);
    }
  };

  const updateSpeaker = async (speaker: Speaker) => {
    try {
      setLoading(true);
      const updatedSpeaker = await updateSpeakerAPI(speaker);
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
