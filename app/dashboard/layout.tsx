import { Aside } from "@/components/sidebar/Aside";
import { Header } from "@/components/sidebar/Header";
import { Files, LayoutDashboard, Users } from "lucide-react";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard data-icon="inline-start" /> },
    { label: 'Users', icon: <Users data-icon="inline-start" />, admin: true },
    { label: 'Excels', icon: <Files data-icon="inline-start" /> },
  ]

  const navItemsAside = [
    { label: 'Dashboard', icon: <LayoutDashboard className="size-4" /> },
    { label: 'Users', icon: <Users className="size-4" />, admin: true },
    { label: 'Excels', icon: <Files className="size-4" /> },
  ]

  return (
    <>
      <div className="min-h-screen bg-muted/30 text-foreground">
        <Aside navItems={navItemsAside} />
        <div className="lg:pl-64">
          <Header navItems={navItems} />
          {children}
        </div>
      </div>
    </>
  );
}