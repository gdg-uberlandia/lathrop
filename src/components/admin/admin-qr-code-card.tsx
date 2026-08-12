import { Button } from "@/assets/components/ui/button";
import { Download, QrCode } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type AdminQrCodeCardProps = {
  value: string | null | undefined;
  downloadName: string;
  entityLabel: string;
};

export function AdminQrCodeCard({
  value,
  downloadName,
  entityLabel,
}: AdminQrCodeCardProps) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!value) {
      setPreview("");
      return;
    }
    let mounted = true;
    void import("qrcode").then(({ default: QRCode }) =>
      QRCode.toDataURL(value, { width: 320, margin: 2 }).then((result) => {
        if (mounted) setPreview(result);
      }),
    );
    return () => {
      mounted = false;
    };
  }, [value]);

  if (!value) return null;

  return (
    <section className="overflow-hidden rounded-2xl border !border-slate-200 bg-slate-50/70">
      <div className="flex items-center gap-3 border-b !border-slate-200 bg-white px-4 py-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <QrCode className="size-5" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            QR Code público
          </h3>
          <p className="text-xs text-slate-500">
            Usado para identificar {entityLabel} na experiência do participante.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="flex size-36 shrink-0 items-center justify-center rounded-xl border !border-slate-200 bg-white p-2">
          {preview ? (
            <Image
              src={preview}
              alt={`QR Code de ${entityLabel}`}
              width={128}
              height={128}
              unoptimized
            />
          ) : (
            <QrCode className="size-12 animate-pulse text-slate-300" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Identificador
          </p>
          <code className="mt-1 block break-all rounded-lg bg-white px-3 py-2 text-xs text-slate-600">
            {value}
          </code>
          {preview && (
            <Button
              asChild
              variant="outline"
              className="mt-3 !border-blue-200 !bg-white !text-blue-700 hover:!bg-blue-50"
            >
              <a href={preview} download={`${downloadName}.png`}>
                <Download className="size-4" /> Baixar QR Code
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
