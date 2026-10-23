import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";

export default function UsersPage() {
  const users = [{ name: 'Jordan Davis', email: 'jordan@sheetwise.co', role: 'Admin', access: 'All workbooks' }, { name: 'Maya Chen', email: 'maya@northstar.co', role: 'User', access: '2 workbooks' }, { name: 'Elliot Stone', email: 'elliot@lumen.studio', role: 'User', access: '1 workbook' }]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team members</CardTitle>
          <CardDescription>Manage access to your workbook data.</CardDescription>
        </div>
        <Button>
          <Users data-icon="inline-start" />Create user
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Workbook access</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) =>
              <TableRow key={user.email}>
                <TableCell>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'Admin' ? 'default' : 'outline'}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user.access}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Manage access</Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}