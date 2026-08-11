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
import { Speaker } from "@/models/speaker";
import AdminLayout from "@/layouts/admin-layout";
import { Megaphone, Pencil, Trash2, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Speakers() {
  const router = useRouter();
  const { speakers, removeSpeaker, loading } = useSpeakers();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);

  return (
    <AdminLayout>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-devGray-light/40">
            <Megaphone />
          </div>
          <h1 className="grow text-xl text-white/80">Palestrantes</h1>
          <Link
            href="/admin/speakers/add-speaker"
            aria-label="Cadastrar palestrante"
            className="flex size-12 items-center justify-center rounded-full bg-devBlue-dark text-white"
          >
            <UserRoundPlus />
          </Link>
        </div>
        <div className="mt-12">
          <Table>
            <TableHeader className="bg-devGray-dark">
              <TableRow>
                <TableHead />
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white">Cargo / empresa</TableHead>
                <TableHead className="text-white">Visível</TableHead>
                <TableHead />
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {speakers.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      src={item.photoUrl ?? "/default-speaker.png"}
                      width={40}
                      height={40}
                      alt={`Foto de ${item.name}`}
                      className="size-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="text-white/80">{item.name}</TableCell>
                  <TableCell className="text-white/80">
                    {[item.title, item.company].filter(Boolean).join(" · ") ||
                      "—"}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {item.isVisible ? "Sim" : "Não"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/speakers/edit/${item.id}`)
                      }
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setSpeaker(item)}
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
        open={Boolean(speaker)}
        onClose={() => setSpeaker(null)}
        onConfirm={async () => {
          if (speaker) await removeSpeaker(speaker.id);
          setSpeaker(null);
        }}
      />
    </AdminLayout>
  );
}
