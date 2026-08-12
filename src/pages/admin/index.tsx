import {
  AdminLoadingState,
  AdminPageHeader,
} from "@/components/admin/admin-page";
import { useMissions } from "@/hooks/useMissions";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useSponsors } from "@/hooks/useSponsors";
import { useTalks } from "@/hooks/useTalks";
import { AlertTriangle, ArrowRight, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-muted/30 p-5">
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function AdminIndex() {
  const { speakers, loading: loadingSpeakers } = useSpeakers();
  const { sponsors, loading: loadingSponsors } = useSponsors();
  const { talks, loading: loadingTalks } = useTalks();
  const { missions, loading: loadingMissions } = useMissions();
  const sponsorCount = sponsors.reduce(
    (total, level) => total + level.items.length,
    0,
  );
  const incompleteSpeakers = speakers.filter(
    (speaker) => !speaker.photoUrl || !speaker.miniBio,
  );
  const inactiveTalks = talks.filter((talk) => !talk.isActive);
  const inactiveMissions = missions.filter((mission) => !mission.active);
  const loading =
    loadingSpeakers || loadingSponsors || loadingTalks || loadingMissions;

  return (
    <main className="p-4 sm:p-6">
      <AdminPageHeader
        title="Painel administrativo"
        description="Acompanhe o catálogo do evento e resolva pendências."
        icon={LayoutDashboard}
      />
      {loading && speakers.length + talks.length + missions.length === 0 ? (
        <div className="mt-6">
          <AdminLoadingState />
        </div>
      ) : (
        <>
          <section
            className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Resumo do evento"
          >
            <MetricCard label="Palestrantes" value={speakers.length} />
            <MetricCard
              label="Palestras ativas"
              value={talks.length - inactiveTalks.length}
            />
            <MetricCard label="Patrocinadores" value={sponsorCount} />
            <MetricCard
              label="Missões ativas"
              value={missions.length - inactiveMissions.length}
            />
          </section>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-white/10 p-5">
              <h2 className="font-semibold text-white">Pendências</h2>
              <div className="mt-4 space-y-3">
                {[
                  [
                    incompleteSpeakers.length,
                    "palestrantes sem foto ou biografia",
                    "/admin/speakers",
                  ],
                  [inactiveTalks.length, "palestras inativas", "/admin/talks"],
                  [
                    inactiveMissions.length,
                    "missões inativas",
                    "/admin/missions",
                  ],
                ].map(([count, label, href]) => (
                  <Link
                    key={String(label)}
                    href={String(href)}
                    className="flex items-center gap-3 rounded-lg bg-white/5 p-3 hover:bg-white/10"
                  >
                    <AlertTriangle className="size-4 text-devYellow-dark" />
                    <span className="flex-1 text-sm text-white/70">
                      {count} {label}
                    </span>
                    <ArrowRight className="size-4 text-white/40" />
                  </Link>
                ))}
              </div>
            </section>
            <section className="rounded-xl border border-white/10 p-5">
              <h2 className="font-semibold text-white">Cadastros rápidos</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Palestrante", "/admin/speakers/add-speaker"],
                  ["Palestra", "/admin/talks/add-talk"],
                  ["Patrocinador", "/admin/sponsors/add-sponsor"],
                  ["Missão", "/admin/missions/add-mission"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 rounded-lg border border-white/10 p-3 text-sm text-white/70 hover:border-devBlue-dark hover:text-white"
                  >
                    <Plus className="size-4" />
                    {label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}

export default AdminIndex;
