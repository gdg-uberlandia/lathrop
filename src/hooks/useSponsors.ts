import { useEffect, useState, useCallback } from "react";
import { Sponsor } from "models/sponsor";
import { fetchSponsorsAPI } from "../front-features/sponsors";
import { SponsorLevel } from "@/models/sponsor-level";
import { deleteSponsorAPI } from "front-features/sponsors";

export function useSponsors() {
  const [sponsors, setSponsors] = useState<SponsorLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSponsors = useCallback(async () => {
    try {
      setLoading(true);

      // TODO: Remover este timeout (foi colocado apenas para testes)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const data = await fetchSponsorsAPI();
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
  // const fetchSponsor = useCallback(async (sponsorId: string) => {
  //   try {
  //     setLoading(true);

  //     // TODO: Remover este timeout (foi colocado apenas para testes)
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     const sponsor = await fetchSponsorAPI(sponsorId);
  //     return sponsor;
  //   } catch (err) {
  //     console.error(err);
  //     setError("Erro ao buscar sponsor específico");
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const addSponsor = async (sponsor: any) => {
  //   try {
  //     setLoading(true);

  //     // TODO: Remover este timeout (foi colocado apenas para testes)
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     const newSponsor = await createSponsorAPI({
  //       ...sponsor,
  //       canBeEvaluated: false,
  //     });
  //     setSponsors((prev) => [...prev, newSponsor]);
  //     return newSponsor as Sponsor;
  //   } catch (err) {
  //     console.error(err);
  //     setError("Erro ao criar sponsor");
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const removeSponsor = async (key: string) => {
  //   try {
  //     setLoading(true);

  //     // TODO: Remover este timeout (foi colocado apenas para testes)
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     await deleteSponsorAPI(key);
  //     setSponsors((prev) => prev.filter((s) => s.key !== key));
  //   } catch (err) {
  //     console.error(err);
  //     setError("Erro ao deletar sponsor");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const updateSponsor = async (sponsor: any) => {
  //   try {
  //     setLoading(true);

  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     const updatedSponsor = await updateSponsorAPI(sponsor);
  //     setSponsors((prev) =>
  //       prev.map((s) => (s.key === updatedSponsor.key ? updatedSponsor : s)),
  //     );
  //     return updatedSponsor as Sponsor;
  //   } catch (err) {
  //     console.error(err);
  //     setError("Erro ao atualizar sponsor");
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!sponsors.length) fetchSponsors();
  }, [fetchSponsors, sponsors.length]);

  return {
    sponsors,
    loading,
    error,
    fetchSponsors,
    // fetchSponsor,
    // addSponsor,
    removeSponsor,
    // updateSponsor,
  };
}
