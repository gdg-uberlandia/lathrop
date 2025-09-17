import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/assets/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Button } from "@/assets/components/ui/button";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return null;
  console.log(user);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="w-full mx-auto">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center justify-end gap-6 w-full">
              <span className="text-xs">{user.email}</span>
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
