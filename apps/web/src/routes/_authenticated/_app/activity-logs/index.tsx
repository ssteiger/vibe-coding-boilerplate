import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { ColumnDef } from '@tanstack/react-table'
import { postgres_db, schema } from '@vibe-coding-boilerplate/db-drizzle'
import { desc } from 'drizzle-orm'

import { DataTable } from '~/lib/components/ui/data-table'

interface Log {
  id: number
  created_at: string | null
  message: string
}

// Limit to the most recent 1000 logs and order by creation time (newest first).
const fetchLogs = createServerFn({ method: 'GET' }).handler(async () => {
  return postgres_db.select().from(schema.logs).orderBy(desc(schema.logs.created_at)).limit(1000)
})

const columns: ColumnDef<Log>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 80,
  },
  {
    accessorKey: 'created_at',
    header: 'Timestamp',
    size: 200,
    cell: ({ row }) => {
      const value = row.getValue<string | null>('created_at')
      return value ? new Date(value).toLocaleString() : '—'
    },
  },
  {
    accessorKey: 'message',
    header: 'Message',
    size: 600,
    cell: ({ row }) => {
      const message = row.getValue<string>('message')
      if (message.includes('ERROR:')) {
        return <span className="text-red-500">{message}</span>
      }
      if (message.includes('WARNING:')) {
        return <span className="text-amber-500">{message}</span>
      }
      return <span>{message}</span>
    },
  },
]

const LogsPage = () => {
  const {
    data: logs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['logs'],
    queryFn: () => fetchLogs(),
    refetchInterval: 10_000,
  })

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Logs</h2>
      </div>

      <p className="text-muted-foreground">
        Showing the most recent system logs. Logs are automatically refreshed every 10 seconds.
      </p>

      <DataTable
        data={logs ?? []}
        columns={columns}
        isLoading={isLoading}
        refetch={refetch}
        defaultSort={[{ id: 'created_at', desc: true }]}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/_app/activity-logs/')({
  component: LogsPage,
})
