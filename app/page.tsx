import { ExcelDashboard } from "@/components/Dashboard";

export const tmpUser = { user: { name: 'Jazael Moreno', email: 'Martinjaza@gmail.com', role: 'Admin' } };

export default function Home() {
  return (
    <ExcelDashboard {...tmpUser} />
  );
}
