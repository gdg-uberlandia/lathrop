import {
  Bell,
  Printer,
  Users,
  Calendar,
  Building2,
  DollarSign,
  Home,
  Megaphone,
  Presentation,
  Trophy,
  Tags,
  Gift,
  Package,
  type LucideIcon,
} from "lucide-react";

export type AdminNavigationItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  { title: "Painel", url: "/admin", icon: Home, exact: true },
  { title: "Avisos", url: "/admin/notices", icon: Bell },
  { title: "Empresas", url: "/admin/companies", icon: Building2 },
  { title: "Missões", url: "/admin/missions", icon: Trophy },
  { title: "Palestrantes", url: "/admin/speakers", icon: Megaphone },
  { title: "Palestras", url: "/admin/talks", icon: Presentation },
  { title: "Participantes", url: "/admin/participants", icon: Users },
  { title: "Patrocinadores", url: "/admin/sponsors", icon: DollarSign },
  { title: "Programação", url: "/admin/schedule", icon: Calendar },
  { title: "Brindes da Pokédex", url: "/admin/rewards", icon: Package },
  { title: "Prêmios", url: "/admin/raffles", icon: Gift },
  { title: "QR codes imprimíveis", url: "/admin/qr-print", icon: Printer },
  { title: "Tags", url: "/admin/tags", icon: Tags },
];

export function getAdminNavigationItems(pushEnabled: boolean) {
  return adminNavigationItems.filter(
    (item) => pushEnabled || item.url !== "/admin/notices",
  );
}

export function isAdminNavigationItemActive(
  pathname: string,
  item: AdminNavigationItem,
) {
  return item.exact
    ? pathname === item.url
    : pathname === item.url || pathname.startsWith(`${item.url}/`);
}

export function getAdminBreadcrumbs(pathname: string) {
  const breadcrumbs = [{ title: "Painel", url: "/admin" as string | null }];
  const section = adminNavigationItems.find(
    (item) => !item.exact && isAdminNavigationItemActive(pathname, item),
  );

  if (!section) return breadcrumbs.map((item) => ({ ...item, url: null }));
  breadcrumbs.push({ title: section.title, url: section.url });

  if (pathname.includes("/add-")) {
    breadcrumbs.push({ title: "Cadastrar", url: null });
  } else if (pathname.includes("/edit/")) {
    breadcrumbs.push({ title: "Editar", url: null });
  } else {
    breadcrumbs[breadcrumbs.length - 1].url = null;
  }

  return breadcrumbs;
}
