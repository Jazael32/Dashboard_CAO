import type { NavItems } from '@/app/interfaces/DashboardInterfaces';

type NavItem = NavItems['navItems'][number];

//Para estar en la ruta activa aun si utilizo IDS o UUID
export function getActiveItem(navItems: NavItem[], pathname: string) {
  return navItems.find(
    (item) => pathname === item.path || pathname.startsWith(item.path + '/'),
  );
}