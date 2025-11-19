import { Button } from "@/assets/components/ui/button";
import { Switch } from "@/assets/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/assets/components/ui/table";
import DeleteDialog from "@/components/admin/delete-dialog";
import Loading from "@/components/admin/loading-overlay";
import { useSpeakers } from "@/hooks/useSpeakers";
import { Speaker } from "@/models/speaker";
import AdminLayout from "layouts/admin-layout";
import { Megaphone, Pencil, Trash2, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Speakers() {
  const router = useRouter();
  const { speakers, removeSpeaker, updateSpeaker, error, loading } =
    useSpeakers();

  const [speaker, setSpeaker] = useState<Speaker | null>();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const handleUpdateEvaluable = (speaker: Speaker) => {
    if (!speaker) return;
    speaker.canBeEvaluated = !speaker.canBeEvaluated;
    updateSpeaker(speaker);
  };

  const handleUpdateVisible = (speaker: Speaker) => {
    if (!speaker) return;
    speaker.showSpeaker = !speaker.showSpeaker;
    updateSpeaker(speaker);
  };

  const handleOpenDialogDelete = (value: Speaker) => {
    if (!value) return;
    setSpeaker(value);
    setDialogDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!speaker) return;
    removeSpeaker(speaker.id);
    setSpeaker(null);
    setDialogDeleteOpen(false);
  };

  return (
    <AdminLayout>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex w-full items-center gap-2 justify-between">
          <div className="size-12 rounded-full bg-devGray-light/40 flex items-center justify-center">
            <Megaphone />
          </div>
          <div className="grow">
            <h1 className="text-xl text-white/80">Palestrantes</h1>
          </div>
          <Link
            href="/admin/speakers/add-speaker"
            className="text-white bg-devBlue-dark border-1 border-devBlue-dark hover:border-1 hover:border-white/60 size-12 flex items-center justify-center rounded-full"
          >
            <UserRoundPlus />
          </Link>
        </div>

        <div className="mt-12">
          <Table className="rounded-xl overflow-hidden border-collapse">
            <TableCaption />
            <TableHeader className="bg-devGray-dark text-white">
              <TableRow>
                <TableHead className="p-3 text-white "></TableHead>
                <TableHead className="p-3 text-white ">Nome</TableHead>
                <TableHead className="p-3 text-white ">Palestra</TableHead>
                <TableHead className="p-3 text-white text-center">
                  Avaliável
                </TableHead>
                <TableHead className="p-3 text-white text-center">
                  Visível
                </TableHead>
                <TableHead className="p-3 text-white text-center"></TableHead>
                <TableHead className="p-3 text-white text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {speakers.map((speaker) => (
                <TableRow key={speaker.id}>
                  <TableCell className="p-3 text-white/80 font-medium">
                    <Image
                      src={speaker.photo ?? "/default-speaker.png"}
                      width={40}
                      height={40}
                      alt={
                        speaker.name
                          ? `Foto de ${speaker.name}`
                          : "Foto do palestrante"
                      }
                      className="rounded-full object-cover outline outline-offset-2 outline-1 outline-devGray-light"
                    />
                  </TableCell>
                  <TableCell className="p-3 text-white/80 font-medium">
                    {speaker.name}
                  </TableCell>
                  <TableCell className="p-3 text-white/80 ">
                    {speaker.topic.length > 54
                      ? `${speaker.topic.slice(0, 51)}...`
                      : speaker.topic}
                  </TableCell>
                  <TableCell className=" text-white/80 text-center">
                    <Switch
                      id={`speaker-${speaker.id}-evaluable`}
                      disabled={loading}
                      checked={speaker.canBeEvaluated}
                      onCheckedChange={() => handleUpdateEvaluable(speaker)}
                      className="data-[state=checked]:bg-devBlue-dark disabled:!pointer-events-none"
                    />
                  </TableCell>
                  <TableCell className=" text-white/80 text-center">
                    <Switch
                      id={`speaker-${speaker.id}-visible`}
                      disabled={loading}
                      checked={speaker.showSpeaker}
                      onCheckedChange={() => handleUpdateVisible(speaker)}
                      className="data-[state=checked]:bg-devBlue-dark disabled:!pointer-events-none"
                    />
                  </TableCell>
                  <TableCell className="px-3 text-white/80 text-right">
                    <Button
                      disabled={loading}
                      variant="secondary"
                      size="icon"
                      className="size-8 text-devGreen-dark hover:text-devGreen bg-transparent p-0"
                      onClick={() =>
                        router.push(`/admin/speakers/edit/${speaker.id}`)
                      }
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                  <TableCell className="px-3 text-white/80 text-right">
                    <Button
                      variant="secondary"
                      size="icon"
                      disabled={loading}
                      className="size-8 text-devRed-dark hover:text-devRed bg-transparent p-0"
                      onClick={() => handleOpenDialogDelete(speaker)}
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
        open={dialogDeleteOpen}
        onClose={() => setDialogDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
