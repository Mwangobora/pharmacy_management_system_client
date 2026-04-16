import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const auditRows = [
  { id: 'EVT-1042', actor: 'francis.m', action: 'Updated role permissions', target: 'Role: Pharmacist', time: '2 min ago', status: 'Success' },
  { id: 'EVT-1041', actor: 'system', action: 'Session timeout enforcement', target: 'Security Policy', time: '7 min ago', status: 'Success' },
  { id: 'EVT-1039', actor: 'anna.n', action: 'Failed login attempts (3)', target: 'User: cashier-02', time: '15 min ago', status: 'Warning' },
  { id: 'EVT-1036', actor: 'francis.m', action: 'Created user account', target: 'User: stores.lead', time: '35 min ago', status: 'Success' },
]

export default function AuditLogsPage() {
  return (
    <div className="space-y-5">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input placeholder="Search logs by event, actor, or resource..." className="md:max-w-sm" />
            <Input type="date" className="md:w-[170px]" />
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="pt-5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.actor}</TableCell>
                    <TableCell>{row.action}</TableCell>
                    <TableCell className="text-muted-foreground">{row.target}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'Warning' ? 'secondary' : 'default'}>{row.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
