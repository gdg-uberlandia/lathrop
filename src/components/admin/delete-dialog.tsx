import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/assets/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";

export default function DeleteDialog({
  open,
  onConfirm,
  onClose,
  title = "Tem certeza que deseja realizar a exclusão?",
  description = "Esta ação não pode ser desfeita. Isso irá remover permanentemente os dados do registro.",
  confirmText = "Excluir",
  cancelText = "Cancelar",
}: {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="border-1 border-white/40 p-5 !rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="size-12 rounded-full bg-devRed-dark text-devRed-light flex items-center justify-center mx-auto mb-4">
              <TriangleAlert />
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex grow gap-3">
          <AlertDialogCancel
            onClick={onClose}
            className="m-0 w-full rounded-xl text-white"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="m-0 w-full rounded-xl text-white bg-devRed-dark hover:bg-devRed"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
