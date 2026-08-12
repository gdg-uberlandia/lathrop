import { cn } from "@/assets/lib/utils";
import { shouldBypassImageOptimization } from "@/helpers/image";
import { ImagePlus, Loader2, RefreshCw, UploadCloud } from "lucide-react";
import Image from "next/image";
import { DragEvent, useId, useState } from "react";

type AdminImageUploadProps = {
  value?: string | null;
  label: string;
  description?: string;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  previewFit?: "contain" | "cover";
  onFileSelect: (file: File) => Promise<unknown> | unknown;
};

const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp,image/gif";

export function AdminImageUpload({
  value,
  label,
  description = "PNG, JPG, WebP ou GIF de até 5 MB.",
  loading = false,
  error,
  disabled = false,
  previewFit = "contain",
  onFileSelect,
}: AdminImageUploadProps) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const unavailable = loading || disabled;

  const selectFile = (file?: File) => {
    if (!file || unavailable) return;
    void Promise.resolve(onFileSelect(file)).catch(() => undefined);
  };
  const drop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!unavailable) setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        className={cn(
          "group flex min-h-36 cursor-pointer items-center gap-4 rounded-xl border border-dashed !border-slate-300 bg-slate-50 p-4 transition",
          "hover:!border-blue-400 hover:bg-blue-50/60",
          dragging && "!border-blue-500 bg-blue-50 ring-2 ring-blue-100",
          unavailable && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGES}
          className="sr-only"
          disabled={unavailable}
          onChange={(event) => {
            selectFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border !border-slate-200 bg-white">
          {value ? (
            <Image
              src={value}
              alt={`Prévia de ${label.toLocaleLowerCase("pt-BR")}`}
              width={96}
              height={96}
              unoptimized={shouldBypassImageOptimization(value)}
              className={cn(
                "size-full",
                previewFit === "cover" ? "object-cover" : "object-contain p-2",
              )}
            />
          ) : (
            <ImagePlus className="size-8 text-slate-300" />
          )}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            {loading ? (
              <Loader2 className="size-4 animate-spin text-blue-600" />
            ) : value ? (
              <RefreshCw className="size-4 text-blue-600" />
            ) : (
              <UploadCloud className="size-4 text-blue-600" />
            )}
            {loading
              ? "Enviando imagem..."
              : value
                ? "Trocar imagem"
                : "Selecionar imagem"}
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Arraste o arquivo aqui ou clique para procurar.
          </p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
      </label>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
