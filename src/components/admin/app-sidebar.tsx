import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/assets/components/ui/sidebar";
import { LogoGDG } from "@/assets/images/LogoGDG";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  adminNavigationItems,
  isAdminNavigationItemActive,
} from "./admin-navigation";

export function AppSidebar() {
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-16">
        <LogoGDG inverted width={220} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1">
            <SidebarMenu className="gap-1">
              {adminNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isAdminNavigationItemActive(
                      router.pathname,
                      item,
                    )}
                    className="data-[active=true]:bg-devBlue-dark data-[active=true]:text-white"
                  >
                    <Link
                      href={item.url}
                      className="text-white h-14 rounded-xl px-3"
                      aria-current={
                        isAdminNavigationItemActive(router.pathname, item)
                          ? "page"
                          : undefined
                      }
                    >
                      <item.icon className="!size-5 mr-1" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
