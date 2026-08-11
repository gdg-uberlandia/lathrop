import { Talk, TalkInput } from "@/contracts/talk";
import {
  createTalkAPI,
  deleteTalkAPI,
  getTalksAPI,
  readTalkAPI,
  updateTalkAPI,
} from "@/front-features/talks";
import { useCallback, useEffect, useState } from "react";

export function useTalks() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTalks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTalks(await getTalksAPI());
      setError(null);
    } catch {
      setError("Erro ao buscar palestras");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTalk = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await readTalkAPI(id);
    } catch (requestError) {
      console.error(requestError);
      setError("Erro ao buscar palestra");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTalk = async (input: TalkInput) => {
    setLoading(true);
    setError(null);
    try {
      const talk = await createTalkAPI(input);
      setTalks((current) => [...current, talk]);
      return talk;
    } catch (requestError) {
      console.error(requestError);
      setError("Erro ao cadastrar palestra");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateTalk = async (input: TalkInput) => {
    setLoading(true);
    setError(null);
    try {
      const talk = await updateTalkAPI(input);
      setTalks((current) =>
        current.map((item) => (item.id === talk.id ? talk : item)),
      );
      return talk;
    } catch (requestError) {
      console.error(requestError);
      setError("Erro ao atualizar palestra");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const removeTalk = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTalkAPI(id);
      setTalks((current) => current.filter((talk) => talk.id !== id));
    } catch (requestError) {
      console.error(requestError);
      setError("Erro ao excluir palestra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTalks();
  }, [fetchTalks]);
  return {
    talks,
    loading,
    error,
    fetchTalks,
    fetchTalk,
    addTalk,
    updateTalk,
    removeTalk,
  };
}
