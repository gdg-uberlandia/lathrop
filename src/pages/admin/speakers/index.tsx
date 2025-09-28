import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/assets/components/ui/table";
import { useSpeakers } from "@/hooks/useSpeakers";
import AdminLayout from "layouts/admin-layout";
import {
  Megaphone,
  TriangleAlert,
  Pencil,
  Trash2,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import { Speaker } from "@/models/speaker";
import { Checkbox } from "@/assets/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Loading from "@/components/admin/loading-overlay";

function Speakers() {
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
    <>
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
                    <Checkbox
                      disabled={loading}
                      checked={speaker.canBeEvaluated}
                      onClick={() => handleUpdateEvaluable(speaker)}
                      className="disabled:!pointer-events-none data-[state=checked]:text-white border-white/50 border-1 dark:data-[state=checked]:border-devBlue-dark dark:data-[state=checked]:bg-devBlue-dark size-5"
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
    </>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/assets/components/ui/alert-dialog";
import { Button } from "@/assets/components/ui/button";

function DeleteDialog({
  open,
  onConfirm,
  onClose,
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const handleCancel = () => {
    onClose();
  };
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="border-1 border-white/40 p-5 !rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="size-12 rounded-full bg-devRed-dark text-devRed-light flex items-center justify-center mx-auto mb-4">
              <TriangleAlert />
            </div>
            Tem certeza que deseja realizar a exclusão?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso irá remover permanentemente os
            dados do registro.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex grow gap-3">
          <AlertDialogCancel
            onClick={handleCancel}
            className="m-0 w-full rounded-xl text-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="m-0 w-full rounded-xl text-white bg-devRed-dark hover:bg-devRed"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

Speakers.layout = AdminLayout;

export default Speakers;
