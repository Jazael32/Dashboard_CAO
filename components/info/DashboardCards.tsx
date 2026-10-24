import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

interface StatCard {
  label: string,
  value: string,
  change: string,
  details: string
}

export const DashboardCards = ({ label, value, change, details }: StatCard) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Badge variant="secondary" className="font-medium">{change}</Badge>
        </div>
        <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{details}</p>
      </CardContent>
    </Card>
  )
}