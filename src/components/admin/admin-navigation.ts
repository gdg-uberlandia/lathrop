import {
  Calendar,
  Building2,
  DollarSign,
  Home,
  Megaphone,
  Presentation,
  Trophy,
  Tags,
  Gift,
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
  { title: "Palestrantes", url: "/admin/speakers", icon: Megaphone },
  { title: "Palestras", url: "/admin/talks", icon: Presentation },
  { title: "Patrocinadores", url: "/admin/sponsors", icon: DollarSign },
  { title: "Empresas", url: "/admin/companies", icon: Building2 },
  { title: "Programação", url: "/admin/schedule", icon: Calendar },
  { title: "Missões", url: "/admin/missions", icon: Trophy },
  { title: "Tags", url: "/admin/tags", icon: Tags },
  { title: "Prêmios", url: "/admin/raffles", icon: Gift },
];

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
