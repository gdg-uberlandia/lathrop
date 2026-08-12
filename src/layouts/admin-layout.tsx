import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/assets/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Button } from "@/assets/components/ui/button";
import { getAdminBreadcrumbs } from "@/components/admin/admin-navigation";
import { adminNavigationItems } from "@/components/admin/admin-navigation";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { ChevronDown, ChevronRight, LogOut, Plus, Search } from "lucide-react";
import { AdminRouteProgress } from "@/components/admin/admin-route-progress";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout, loading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      const destination = !user
        ? loggingOut
          ? "/login"
          : `/login?next=${encodeURIComponent(router.asPath)}`
        : `/unauthorized?next=${encodeURIComponent(router.asPath)}`;
      router.replace(destination);
    }
  }, [user, isAdmin, loading, loggingOut, router]);

  if (loading) {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <IconLoader2 className="size-5 animate-spin text-devBlue-dark" />
          Verificando sua sessão...
        </div>
      </div>
    );
  }
  if (!loading && (!user || !isAdmin)) {
    return null;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };
  const breadcrumbs = getAdminBreadcrumbs(router.pathname);
  const handleAdminSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = adminSearch.trim().toLocaleLowerCase("pt-BR");
    const destination = adminNavigationItems.find((item) =>
      item.title.toLocaleLowerCase("pt-BR").includes(term),
    );
    if (destination) {
      setAdminSearch("");
      void router.push(destination.url);
    }
  };

  return (
    <div className="admin-shell min-h-screen w-full">
      <AdminRouteProgress />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="admin-content min-w-0">
          <header className="admin-topbar sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b px-4 lg:px-6">
            <SidebarTrigger className="-ml-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900" />
            <nav
              aria-label="Navegação estrutural"
              className="hidden min-w-0 flex-1 items-center gap-1 text-sm sm:flex"
            >
              {breadcrumbs.map((breadcrumb, index) => (
                <div
                  key={`${breadcrumb.title}-${index}`}
                  className="flex min-w-0 items-center gap-1"
                >
                  {index > 0 && (
                    <ChevronRight className="size-4 shrink-0 text-slate-300" />
                  )}
                  {breadcrumb.url ? (
                    <Link
                      href={breadcrumb.url}
                      className="truncate text-slate-500 hover:text-slate-900"
                    >
                      {breadcrumb.title}
                    </Link>
                  ) : (
                    <span className="truncate font-medium text-slate-900">
                      {breadcrumb.title}
                    </span>
                  )}
                </div>
              ))}
            </nav>
            <div className="ml-auto flex min-w-0 items-center gap-2">
              <form
                onSubmit={handleAdminSearch}
                className="relative hidden xl:block"
              >
                <label>
                  <span className="sr-only">Buscar seção do painel</span>
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={adminSearch}
                    onChange={(event) => setAdminSearch(event.target.value)}
                    placeholder="Buscar seção..."
                    className="h-9 w-64 rounded-lg border bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </form>
              <details className="group relative hidden sm:block">
                <summary className="admin-primary-action flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg bg-blue-600 px-3 text-sm font-medium shadow-sm hover:bg-blue-700">
                  <Plus className="size-4" />
                  Novo cadastro
                  <ChevronDown className="size-3.5 transition group-open:rotate-180" />
                </summary>
                <div className="admin-surface absolute right-0 top-11 z-50 w-52 rounded-lg p-1.5 shadow-xl">
                  {[
                    ["Palestrante", "/admin/speakers/add-speaker"],
                    ["Palestra", "/admin/talks/add-talk"],
                    ["Patrocinador", "/admin/sponsors/add-sponsor"],
                    ["Company", "/admin/companies/add-company"],
                    ["Missão", "/admin/missions/add-mission"],
                    ["Horário", "/admin/schedule/add-schedule"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </details>
              <div className="hidden min-w-0 items-center gap-3 border-l border-slate-200 pl-3 sm:flex">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                  {user?.email?.slice(0, 2).toUpperCase() ?? "AD"}
                </div>
                <div className="hidden min-w-0 lg:block">
                  <p className="text-xs font-semibold text-slate-800">
                    Administrador
                  </p>
                  <p className="max-w-40 truncate text-[11px] text-slate-500">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className="hidden size-4 text-slate-400 lg:block" />
              </div>
              <Button
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Sair da área administrativa"
                variant="ghost"
                size="icon"
                className="text-slate-500 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="size-4" />
                <span className="sr-only">
                  {loggingOut ? "Saindo..." : "Sair"}
                </span>
              </Button>
            </div>
          </header>
          <div className="mx-auto w-full max-w-[1600px] flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default AdminLayout;
