import { Profile } from "@/models/profile";
import { getProfilesAPI } from "@/front-features/profiles";
import { useEffect, useState } from "react";

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfilesAPI();
      setProfiles(data);
    } catch (err: any) {
      setError(err?.message || "Erro ao buscar profiles");
      console.error("Erro ao buscar profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles,
  };
};

