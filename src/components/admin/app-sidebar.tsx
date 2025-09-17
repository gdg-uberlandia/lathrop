import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/assets/components/ui/sidebar";
import { LogoGDG } from "@/assets/images/LogoGDG";
import { Home, Megaphone, Calendar, Tag, DollarSign } from "lucide-react";

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
    url: "#",
    icon: DollarSign,
  },
  {
    title: "Programação",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Tags",
    url: "#",
    icon: Tag,
  },
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
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="text-white hover:!text-devBlue h-12 rounded-xl"
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
