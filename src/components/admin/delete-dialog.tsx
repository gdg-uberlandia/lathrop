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
      <AlertDialogContent className="!rounded-xl !border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <TriangleAlert />
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex grow gap-3">
          <AlertDialogCancel
            onClick={onClose}
            className="m-0 w-full rounded-lg !border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="m-0 w-full rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
