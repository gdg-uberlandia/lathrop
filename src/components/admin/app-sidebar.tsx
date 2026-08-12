import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/assets/components/ui/sidebar";
import { LogoGDG } from "@/assets/images/LogoGDG";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  adminNavigationItems,
  isAdminNavigationItemActive,
} from "./admin-navigation";

export function AppSidebar() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <Sidebar className="admin-sidebar">
      <SidebarHeader className="flex h-20 items-center border-b border-white/10 px-5">
        <LogoGDG inverted width={180} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-2 py-3">
            <SidebarMenu className="gap-1.5">
              {adminNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isAdminNavigationItemActive(
                      router.pathname,
                      item,
                    )}
                    className="h-11 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:font-medium data-[active=true]:text-white"
                  >
                    <Link
                      href={item.url}
                      className="h-11 rounded-lg px-3"
                      aria-current={
                        isAdminNavigationItemActive(router.pathname, item)
                          ? "page"
                          : undefined
                      }
                    >
                      <item.icon className="mr-1 !size-[18px]" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => void logout()}
              className="h-10 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="size-[18px]" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
