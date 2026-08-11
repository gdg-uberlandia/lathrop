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
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { ChevronRight, LogOut } from "lucide-react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout, loading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-white/70">
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

  return (
    <div className="mx-auto w-full">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4">
            <SidebarTrigger className="-ml-1" />
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
                    <ChevronRight className="size-4 shrink-0 text-white/30" />
                  )}
                  {breadcrumb.url ? (
                    <Link
                      href={breadcrumb.url}
                      className="truncate text-white/60 hover:text-white"
                    >
                      {breadcrumb.title}
                    </Link>
                  ) : (
                    <span className="truncate text-white">
                      {breadcrumb.title}
                    </span>
                  )}
                </div>
              ))}
            </nav>
            <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-4">
              <span className="hidden max-w-52 truncate text-xs text-white/60 md:block">
                {user?.email}
              </span>
              <Button
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Sair da área administrativa"
                className="gap-2 rounded-xl border border-devBlue-dark bg-devBlue-dark text-sm text-white hover:border-white hover:bg-devBlue-dark"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">
                  {loggingOut ? "Saindo..." : "Sair"}
                </span>
              </Button>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default AdminLayout;
