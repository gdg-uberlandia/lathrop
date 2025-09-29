import { Sponsor, SponsorLevel } from "@/models/sponsor";
import { useCallback, useEffect, useState } from "react";
import {
  createSponsorAPI,
  deleteSponsorAPI,
  getSponsorsAPI,
  readSponsorAPI,
  updateSponsorAPI,
} from "../front-features/sponsors";

export function useSponsors() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sponsors, setSponsors] = useState<SponsorLevel[]>([]);
  const [sponsorship, setSponsorship] = useState(0);

  const fetchSponsors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSponsorsAPI();
      setSponsors(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar sponsors");
    } finally {
      setLoading(false);
    }
  }, []);

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
        const sponsor = await readSponsorAPI({ sponsorId, sponsorLevel });
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

  const addSponsor = async (sponsor: Sponsor) => {
    try {
      setLoading(true);
      const newSponsor = await createSponsorAPI(sponsor);
      setSponsors((prev) => [...prev, newSponsor]);
      return newSponsor;
    } catch (err) {
      console.error(err);
      setError("Erro ao criar sponsor");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeSponsor = async (sponsorId: string) => {
    try {
      setLoading(true);
      await deleteSponsorAPI(sponsorId);
      setSponsors((data) =>
        data.map((group) => ({
          ...group,
          items: group.items.filter((item) => item.id !== sponsorId),
        })),
      );
    } catch (error) {
      console.error(error);
      setError("Erro ao deletar sponsor");
    } finally {
      setLoading(false);
    }
  };

  const updateSponsor = async (sponsor: Sponsor) => {
    try {
      setLoading(true);
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

  useEffect(() => {
    let total = 0;
    const levelValues: Record<string, number> = {
      diamond: 40,
      gold: 30,
      silver: 20,
      bronze: 10,
      iron: 8,
      ruby: 5,
    };

    sponsors.forEach((sponsor) => {
      if (sponsor.items?.length) {
        const multiplier = levelValues[sponsor.items[0].level] ?? 0;
        const qtd = sponsor.items?.length;
        total += multiplier * qtd;
      }
    });

    setSponsorship(total);
  }, [sponsors]);

  return {
    sponsors,
    loading,
    error,
    fetchSponsors,
    fetchSponsor,
    addSponsor,
    removeSponsor,
    updateSponsor,
    sponsorship,
  };
}
