import { Button } from "@/assets/components/ui/button";
import { Input } from "@/assets/components/ui/input";
import { cn } from "@/assets/lib/utils";
import { IconLoader2 } from "@tabler/icons-react";
import {
  ArrowLeft,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Plus,
  RotateCcw,
  Search,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

export type AdminPageAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  icon?: ComponentType<{ className?: string }>;
};

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
  action?: AdminPageAction | readonly AdminPageAction[];
}) {
  const actions = action ? (Array.isArray(action) ? action : [action]) : [];
  return (
    <header>
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100">
          <Icon className="size-[18px]" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {title}
            </h1>
            {typeof count === "number" && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {count}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {actions.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {actions.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={item.variant === "secondary" ? "outline" : "default"}
              className={
                item.variant === "secondary"
                  ? "h-10 gap-2 rounded-lg !border-blue-200 !bg-white px-4 !text-blue-700 hover:!border-blue-300 hover:!bg-blue-50 hover:!text-blue-800"
                  : "admin-primary-action h-10 gap-2 rounded-lg bg-blue-600 px-4 shadow-sm hover:bg-blue-700"
              }
            >
              <Link href={item.href}>
                {item.icon ? (
                  <item.icon className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </header>
  );
}

export function AdminFormPage({
  title,
  description,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
}) {
  return (
    <main className="p-4 sm:p-6 lg:p-7">
      <div className="mx-auto max-w-5xl">
        <Link
          href={backHref}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
        <header className="mb-6 border-b !border-slate-200 pb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </header>
        {children}
      </div>
    </main>
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
    <div className="admin-surface mt-6 flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Buscar</span>
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar..."
          className="admin-field h-10 rounded-lg pl-9 shadow-none focus-visible:ring-2 focus-visible:ring-blue-100"
        />
      </label>
      {children}
      {search && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
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
    <div className="admin-entity-table admin-surface mt-4 overflow-hidden rounded-xl [&>div]:overflow-x-auto">
      {children}
    </div>
  );
}

export function AdminPagination({
  page,
  pageCount,
  total,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <footer className="flex flex-col gap-3 border-t !border-slate-200 bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-slate-500">{total} registros</p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="!border-slate-300"
        >
          <ChevronLeft className="size-4" /> Anterior
        </Button>
        <span className="px-2 text-xs font-medium text-slate-600">
          {page} de {pageCount}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="!border-slate-300"
        >
          Próxima <ChevronRight className="size-4" />
        </Button>
      </div>
    </footer>
  );
}

export function AdminSortButton({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center gap-1.5 rounded-md px-1 py-1 font-semibold text-slate-700 transition-colors hover:text-slate-950"
    >
      {label}
      <ArrowUpDown
        className={cn(
          "size-3.5",
          active ? "text-blue-600" : "text-slate-300",
          active && direction === "desc" && "rotate-180",
        )}
      />
    </button>
  );
}

export function AdminLoadingState({ label = "Carregando dados..." }) {
  return (
    <div className="admin-surface flex min-h-56 items-center justify-center gap-3 rounded-xl text-sm text-slate-500">
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
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed !border-slate-300 bg-white px-6 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-slate-100">
        <Inbox className="size-6 text-slate-400" />
      </div>
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
      {action && (
        <Button
          asChild
          className="admin-primary-action mt-5 gap-2 rounded-lg bg-blue-600 hover:bg-blue-700"
        >
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
      className="mt-4 rounded-xl border !border-red-200 bg-red-50 p-4"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-red-900">Não foi possível carregar</p>
          <p className="mt-1 text-sm text-red-700">{message}</p>
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
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          active ? "bg-emerald-500" : "bg-slate-400",
        )}
      />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
