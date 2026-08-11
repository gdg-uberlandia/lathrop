import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/assets/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Button } from "@/assets/components/ui/button";

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

  if (loading) return <div>Carregando...</div>;
  if (!loading && (!user || !isAdmin)) {
    return null;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <div className="w-full mx-auto">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky bg-background top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-30">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center justify-end gap-6 w-full">
              <span className="text-xs">{user ? user.email : ""}</span>
              <Button
                onClick={handleLogout}
                className="rounded-xl bg-devBlue-dark border-1 text-white border-devBlue-dark hover:border-1 hover:bg-devBlue-dark hover:!border-white text-sm"
              >
                Logout
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
