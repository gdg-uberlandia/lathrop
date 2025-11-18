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
import {
  Home,
  Megaphone,
  Calendar,
  Map,
  DollarSign,
  Trophy,
} from "lucide-react";

import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "/admin/",
    icon: Home,
  },
  {
    title: "Palestrantes",
    url: "/admin/speakers/",
    icon: Megaphone,
  },
  {
    title: "Patrocinadores",
    url: "/admin/sponsors/",
    icon: DollarSign,
  },
  {
    title: "Programação",
    url: "/admin/schedule",
    icon: Calendar,
  },
  {
    title: "Missoes",
    url: "/admin/missions",
    icon: Trophy,
  },
  // {
  //   title: "Trilhas",
  //   url: "/admin/paths",
  //   icon: Map,
  // },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-16">
        <LogoGDG inverted width={220} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent className="px-1">
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="text-white h-14 rounded-xl px-3"
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
