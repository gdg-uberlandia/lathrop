import { Button } from "@/assets/components/ui/button";
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
import { useMissions } from "@/hooks/useMissions";
import { Mission } from "@/models/mission";
import AdminLayout from "layouts/admin-layout";
import { Target, Pencil, Trash2, Plus, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Missions() {
  const router = useRouter();
  const { missions, removeMission, error, loading } = useMissions();

  const [mission, setMission] = useState<Mission | null>();
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);

  const handleOpenDialogDelete = (value: Mission) => {
    if (!value) return;
    setMission(value);
    setDialogDeleteOpen(true);
  };

  const handleDelete = () => {
    if (!mission) return;
    removeMission(mission.id);
    setMission(null);
    setDialogDeleteOpen(false);
  };

  return (
    <AdminLayout>
      {loading && <Loading />}
      <div className="p-4">
        <div className="flex w-full items-center gap-2 justify-between">
          <div className="size-12 rounded-full bg-devGray-light/40 flex items-center justify-center">
            <Target />
          </div>
          <div className="grow">
            <h1 className="text-xl text-white/80">Missões</h1>
          </div>
          <Link
            href="/admin/missions/add-mission"
            className="text-white bg-devBlue-dark border-1 border-devBlue-dark hover:border-1 hover:border-white/60 size-12 flex items-center justify-center rounded-full"
          >
            <Plus />
          </Link>
        </div>

        <div className="mt-12">
          <Table className="rounded-xl overflow-hidden border-collapse">
            <TableCaption />
            <TableHeader className="bg-devGray-dark text-white">
              <TableRow>
                <TableHead className="p-3 text-white ">Imagem</TableHead>
                <TableHead className="p-3 text-white ">Nome</TableHead>
                <TableHead className="p-3 text-white ">Descrição</TableHead>
                <TableHead className="p-3 text-white text-center">
                  QR Code
                </TableHead>
                <TableHead className="p-3 text-white text-center"></TableHead>
                <TableHead className="p-3 text-white text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell className="p-3 text-white/80">
                    {mission.imageUrl ? (
                      <Image
                        src={mission.imageUrl}
                        alt={mission.title}
                        width={48}
                        height={48}
                        style={{
                          maxWidth: 48,
                          maxHeight: 48,
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-devGray-light/20 rounded flex items-center justify-center">
                        <Target className="w-6 h-6 text-white/40" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="p-3 text-white/80 font-medium">
                    {mission.title}
                  </TableCell>
                  <TableCell className="p-3 text-white/80 ">
                    <span>{mission.description}</span>
                  </TableCell>
                  <TableCell className="p-3 text-white/80 text-center">
                    {mission.validationType === "qr" && (
                      <QrCode className="inline-block text-devBlue-dark" />
                    )}
                  </TableCell>
                  <TableCell className="px-3 text-white/80 text-right">
                    <Button
                      disabled={loading}
                      variant="secondary"
                      size="icon"
                      className="size-8 text-devGreen-dark hover:text-devGreen bg-transparent p-0"
                      onClick={() =>
                        router.push(`/admin/missions/edit/${mission.id}`)
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
                      onClick={() => handleOpenDialogDelete(mission)}
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
