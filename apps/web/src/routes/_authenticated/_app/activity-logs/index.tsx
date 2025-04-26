import { DataTable } from '~/lib/components/ui/data-table'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc, sql } from 'drizzle-orm'
import { postgres_db, schema } from '@vibe-coding-boilerplate/db-drizzle'

/*
create table public.logs (
  id serial not null,
  created_at timestamp with time zone null default now(),
  message text not null,
  constraint logs_pkey primary key (id)
)
*/

// Define the Log type based on the logs table structure
interface Log {
  id: number
  created_at: string
  message: string
}

const serverFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    // Query the logs table
    // Limit to the most recent 1000 logs and order by creation time (newest first)
    const logs = await postgres_db
      .select()
      .from(schema.logs)
      .orderBy(desc(schema.logs.created_at))
      .limit(1000)

    return logs
  })

// Define the columns for the logs table
const columns: ColumnDef<Log>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 80,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Timestamp',
    size: 200,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return date.toLocaleString()
    },
  },
  {
    accessorKey: 'message',
    header: 'Message',
    size: 600,
    cell: ({ row }) => {
      const message = row.getValue('message') as string
      
      // Apply different styling based on message content
      if (message.includes('ERROR:')) {
        return <span className="text-red-500">{message}</span>
      } else if (message.includes('WARNING:')) {
        return <span className="text-amber-500">{message}</span>
      } else {
        return <span>{message}</span>
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
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
    queryFn: () => serverFn(),
    // Refresh logs every 10 seconds
    refetchInterval: 10000,
  })

  console.log({logs})

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Logs</h2>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Refresh Logs
        </button>
      </div>
      
      <p className="text-muted-foreground">
        Showing the most recent system logs. Logs are automatically refreshed every 10 seconds.
      </p>
      
      <DataTable 
        data={logs || []} 
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
