import { Button } from "@/assets/components/ui/button";
import { Input } from "@/assets/components/ui/input";
import { cn } from "@/assets/lib/utils";
import { IconLoader2 } from "@tabler/icons-react";
import { AlertCircle, Inbox, Plus, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

export function AdminPageHeader({
  title,
  description,
  count,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  count?: number;
  icon: ComponentType<{ className?: string }>;
  action?: { href: string; label: string };
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-devGray-light/20">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            {typeof count === "number" && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
                {count}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-white/55">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <Button asChild className="gap-2 rounded-xl bg-devBlue-dark text-white">
          <Link href={action.href}>
            <Plus className="size-4" />
            {action.label}
          </Link>
        </Button>
      )}
    </header>
  );
}

export function AdminListToolbar({
  search,
  onSearchChange,
  children,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-devGray-dark/40 p-3 sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Buscar</span>
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar..."
          className="h-10 rounded-lg border-white/10 bg-background pl-9"
        />
      </label>
      {children}
      {search && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 text-white/60"
          onClick={() => onSearchChange("")}
        >
          <RotateCcw className="size-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}

export function AdminTableContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-background">
      {children}
    </div>
  );
}

export function AdminLoadingState({ label = "Carregando dados..." }) {
  return (
    <div className="flex min-h-56 items-center justify-center gap-3 rounded-xl border border-white/10 text-sm text-white/60">
      <IconLoader2 className="size-5 animate-spin text-devBlue-dark" />
      {label}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 px-6 text-center">
      <Inbox className="mb-3 size-9 text-white/30" />
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-white/55">{description}</p>
      {action && (
        <Button asChild className="mt-5 gap-2 rounded-xl bg-devBlue-dark">
          <Link href={action.href}>
            <Plus className="size-4" />
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
}

export function AdminErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-500/30 bg-red-500/10 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-300" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-red-100">Não foi possível carregar</p>
          <p className="mt-1 text-sm text-red-100/70">{message}</p>
        </div>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}

export function AdminStatusBadge({
  active,
  activeLabel = "Ativo",
  inactiveLabel = "Inativo",
}: {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
        active
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : "border-white/15 bg-white/5 text-white/55",
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
