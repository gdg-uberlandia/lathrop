import { useEffect, useState, useCallback } from "react";
import { Sponsor } from "models/sponsor";
import {
  getSponsorsAPI,
  createSponsorAPI,
  updateSponsorAPI,
  deleteSponsorAPI,
  fetchSponsorAPI,
} from "../front-features/sponsors";
import { SponsorLevel } from "@/models/sponsor-level";

export function useSponsors() {
  const [sponsors, setSponsors] = useState<SponsorLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSponsors = useCallback(async () => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const data = await getSponsorsAPI();
      setSponsors(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar sponsors");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeSponsor = async ({
    sponsorId,
    sponsorLevel,
  }: {
    sponsorId: string;
    sponsorLevel: string;
  }) => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      await deleteSponsorAPI({ sponsorId, sponsorLevel });
      setSponsors((data) =>
        data.map((group) => ({
          ...group,
          items: group.items.filter((item) => item.id !== sponsorId),
        })),
      );
    } catch (err) {
      console.error(err);
      setError("Erro ao deletar speaker");
    } finally {
      setLoading(false);
    }
  };

  const fetchSponsor = useCallback(
    async ({
      sponsorId,
      sponsorLevel,
    }: {
      sponsorId: string;
      sponsorLevel: string;
    }) => {
      try {
        setLoading(true);

        // TODO: Remover este timeout (foi colocado apenas para testes)
        await new Promise((resolve) => setTimeout(resolve, 500));

        const sponsor = await fetchSponsorAPI({ sponsorId, sponsorLevel });
        return sponsor;
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar sponsor específico");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addSponsor = async (sponsor: any) => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newSponsor = await createSponsorAPI({
        ...sponsor,
      });
      setSponsors((prev) => [...prev, newSponsor]);
      return {} as Sponsor;
    } catch (err) {
      console.error(err);
      setError("Erro ao criar sponsor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSponsor = async (sponsor: any) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedSponsor = await updateSponsorAPI(sponsor);
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar sponsor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sponsors.length) fetchSponsors();
  }, [fetchSponsors, sponsors.length]);

  return {
    sponsors,
    loading,
    error,
    fetchSponsors,
    fetchSponsor,
    addSponsor,
    removeSponsor,
    updateSponsor,
  };
}
