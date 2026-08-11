import { Button } from "@/assets/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/assets/components/ui/table";
import DeleteDialog from "@/components/admin/delete-dialog";
import Loading from "@/components/admin/loading-overlay";
import { useSpeakers } from "@/hooks/useSpeakers";
import { useTalks } from "@/hooks/useTalks";
import { Talk } from "@/models/talk";
import AdminLayout from "@/layouts/admin-layout";
import { Pencil, Plus, Presentation, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const formatLabels = {
  talk: "Talk",
  panel: "Painel",
  keynote: "Keynote",
} as const;
export default function TalksPage() {
  const router = useRouter();
  const { talks, removeTalk, loading } = useTalks();
  const { speakers } = useSpeakers();
  const [selected, setSelected] = useState<Talk | null>(null);
  const names = useMemo(
    () => new Map(speakers.map((speaker) => [speaker.id, speaker.name])),
    [speakers],
  );
  return (
    <AdminLayout>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-devGray-light/40">
            <Presentation />
          </div>
          <h1 className="grow text-xl text-white/80">Palestras</h1>
          <Link
            href="/admin/talks/add-talk"
            aria-label="Cadastrar palestra"
            className="flex size-12 items-center justify-center rounded-full bg-devBlue-dark text-white"
          >
            <Plus />
          </Link>
        </div>
        <div className="mt-12">
          <Table>
            <TableHeader className="bg-devGray-dark">
              <TableRow>
                <TableHead className="text-white">Título</TableHead>
                <TableHead className="text-white">Formato</TableHead>
                <TableHead className="text-white">Palestrantes</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead />
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {talks.map((talk) => (
                <TableRow key={talk.id}>
                  <TableCell className="text-white/80">{talk.title}</TableCell>
                  <TableCell className="text-white/80">
                    {formatLabels[talk.format]}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {talk.speakerIds
                      .map((id) => names.get(id) ?? "Palestrante removido")
                      .join(", ")}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {talk.isActive ? "Ativa" : "Inativa"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/talks/edit/${talk.id}`)
                      }
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setSelected(talk)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <DeleteDialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onConfirm={async () => {
          if (selected) await removeTalk(selected.id);
          setSelected(null);
        }}
      />
    </AdminLayout>
  );
}
