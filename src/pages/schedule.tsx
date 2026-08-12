import { getSchedule } from "@/back-features/schedule";
import { getAllSpeakers } from "@/back-features/speakers";
import { getAllTalks } from "@/back-features/talks";
import { Header } from "@/components/devfest-triangulo-2025/Header";
import { ScheduleEntry, SCHEDULE_TRACKS } from "@/contracts/schedule";
import { PublicSpeaker, toPublicSpeaker } from "@/contracts/speaker";
import { PublicTalk, toPublicTalk } from "@/contracts/talk";
import BaseLayout from "@/layouts/base-layout";

type SerializedSchedule = Omit<
  ScheduleEntry,
  "startAt" | "endAt" | "createdAt" | "updatedAt"
> & { startAt: string; endAt: string; createdAt: string; updatedAt: string };
export default function SchedulePage({
  schedule,
  talks,
  speakers,
}: {
  schedule: SerializedSchedule[];
  talks: PublicTalk[];
  speakers: PublicSpeaker[];
}) {
  const talkMap = new Map(talks.map((talk) => [talk.id, talk]));
  const speakerMap = new Map(speakers.map((speaker) => [speaker.id, speaker]));
  const trackNames = new Map(
    SCHEDULE_TRACKS.map((track) => [track.value, track.label]),
  );
  return (
    <BaseLayout>
      <Header isRoot={false} />
      <main className="mx-auto min-h-screen max-w-6xl px-5 py-16 text-white">
        <header className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-bold">Programação do evento</h1>
          <p className="mt-3 text-white/60">
            Confira os horários, trilhas e conteúdos do DevFest Triângulo.
          </p>
        </header>
        <div className="space-y-4">
          {schedule
            .filter((item) => item.active)
            .map((item) => {
              const talk =
                item.activity.type === "talk"
                  ? talkMap.get(item.activity.talkId)
                  : null;
              const title =
                talk?.title ??
                (item.activity.type === "talk"
                  ? "Palestra"
                  : item.activity.title);
              const talkSpeakers =
                talk?.speakerIds
                  .map((id) => speakerMap.get(id))
                  .filter(Boolean) ?? [];
              return (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-[150px_1fr_180px]"
                >
                  <div>
                    <div className="text-lg font-semibold">
                      {new Intl.DateTimeFormat("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(item.startAt))}
                      –
                      {new Intl.DateTimeFormat("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(item.endAt))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{title}</h2>
                    {talk?.description && (
                      <p className="mt-2 text-sm text-white/60">
                        {talk.description}
                      </p>
                    )}
                    {talkSpeakers.length > 0 && (
                      <p className="mt-3 text-sm text-white/80">
                        {talkSpeakers
                          .map((speaker) => speaker?.name)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="md:text-right">
                    <span className="inline-flex rounded-full border border-white/10 px-3 py-1 text-sm text-white/70">
                      {trackNames.get(item.track)}
                    </span>
                  </div>
                </article>
              );
            })}
          {schedule.length === 0 && (
            <p className="rounded-2xl border border-white/10 p-8 text-center text-white/60">
              A programação será publicada em breve.
            </p>
          )}
        </div>
      </main>
    </BaseLayout>
  );
}
export async function getServerSideProps() {
  try {
    const [schedule, talks, speakers] = await Promise.all([
      getSchedule(),
      getAllTalks(),
      getAllSpeakers(),
    ]);
    return {
      props: {
        schedule: schedule.map((item) => ({
          ...item,
          startAt: item.startAt.toISOString(),
          endAt: item.endAt.toISOString(),
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        })),
        talks: talks.map(toPublicTalk),
        speakers: speakers.map(toPublicSpeaker),
      },
    };
  } catch (error) {
    console.error(error);
    return { props: { schedule: [], talks: [], speakers: [] } };
  }
}
