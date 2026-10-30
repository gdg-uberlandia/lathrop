import { IconLoader2 } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-xl">
        <IconLoader2 className="size-5 animate-spin text-blue-600" />
        Processando...
      </div>
    </div>
  );
}
