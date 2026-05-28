import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { ColumnDef } from '@tanstack/react-table'
import { postgres_db, schema } from '@vibe-coding-boilerplate/db-drizzle'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from '@vibe-coding-boilerplate/ui'
import { format, formatDistanceToNow } from 'date-fns'
import { desc } from 'drizzle-orm'
import {
  AlertTriangleIcon,
  CircleAlertIcon,
  InfoIcon,
  RefreshCwIcon,
  ScrollTextIcon,
} from 'lucide-react'
import * as React from 'react'

type LogLevel = 'error' | 'warning' | 'info'

interface LogRow {
  id: number
  created_at: string | null
  message: string
  level: LogLevel
  body: string
}

const REFRESH_INTERVAL_MS = 10_000

const fetchLogs = createServerFn({ method: 'GET' }).handler(async () => {
  return postgres_db.select().from(schema.logs).orderBy(desc(schema.logs.created_at)).limit(1000)
})

function deriveLevel(message: string): { level: LogLevel; body: string } {
  if (message.startsWith('ERROR:')) {
    return { level: 'error', body: message.slice('ERROR:'.length).trim() }
  }
  if (message.startsWith('WARNING:')) {
    return { level: 'warning', body: message.slice('WARNING:'.length).trim() }
  }
  return { level: 'info', body: message }
}

const LEVEL_META: Record<
  LogLevel,
  {
    label: string
    variant: 'destructive' | 'secondary' | 'outline'
    className?: string
    Icon: typeof InfoIcon
  }
> = {
  error: {
    label: 'Error',
    variant: 'destructive',
    Icon: CircleAlertIcon,
  },
  warning: {
    label: 'Warning',
    variant: 'secondary',
    className: 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200',
    Icon: AlertTriangleIcon,
  },
  info: {
    label: 'Info',
    variant: 'outline',
    Icon: InfoIcon,
  },
}

function LevelBadge({ level }: { level: LogLevel }) {
  const meta = LEVEL_META[level]
  return (
    <Badge variant={meta.variant} className={cn('gap-1.5', meta.className)}>
      <meta.Icon className="size-3" />
      {meta.label}
    </Badge>
  )
}

/**
 * Subscribe to a `setInterval`-driven tick so the component re-renders on a
 * cadence without ever writing to React state from a `useEffect`. The
 * returned number is a monotonically-increasing snapshot id — callers don't
 * usually need to read it, just invoking the hook is enough.
 */
function useTick(intervalMs: number): number {
  return React.useSyncExternalStore(
    React.useCallback(
      (onChange) => {
        const id = setInterval(onChange, intervalMs)
        return () => clearInterval(id)
      },
      [intervalMs],
    ),
    () => Math.floor(Date.now() / intervalMs),
    () => 0,
  )
}

function RelativeTime({ value }: { value: string | null }) {
  if (!value) return <span className="text-muted-foreground">—</span>
  const date = new Date(value)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default text-sm tabular-nums">
          {formatDistanceToNow(date, { addSuffix: true })}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{format(date, 'EEE, MMM d yyyy · HH:mm:ss')}</TooltipContent>
    </Tooltip>
  )
}

const columns: ColumnDef<LogRow>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 80,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        #{row.getValue<number>('id')}
      </span>
    ),
  },
  {
    accessorKey: 'level',
    header: 'Level',
    size: 120,
    cell: ({ row }) => <LevelBadge level={row.getValue<LogLevel>('level')} />,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === 'all') return true
      return row.getValue(columnId) === filterValue
    },
    sortingFn: (a, b, columnId) => {
      // Sort by severity (error > warning > info) rather than alphabetically.
      const order: Record<LogLevel, number> = { error: 0, warning: 1, info: 2 }
      return order[a.getValue<LogLevel>(columnId)] - order[b.getValue<LogLevel>(columnId)]
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Time',
    size: 180,
    cell: ({ row }) => <RelativeTime value={row.getValue<string | null>('created_at')} />,
  },
  {
    accessorKey: 'body',
    header: 'Message',
    size: 600,
    cell: ({ row }) => {
      const body = row.getValue<string>('body')
      const level = row.original.level
      return (
        <span
          className={cn(
            'whitespace-pre-wrap break-words font-mono text-xs',
            level === 'error' && 'text-destructive',
          )}
        >
          {body}
        </span>
      )
    },
  },
]

function StatCard({
  title,
  value,
  description,
  Icon,
  accentClassName,
}: {
  title: string
  value: number
  description: string
  Icon: typeof InfoIcon
  accentClassName?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="flex items-center gap-2 text-3xl font-semibold tabular-nums">
          <Icon className={cn('size-5', accentClassName)} />
          {value.toLocaleString()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  )
}

const LogsPage = () => {
  const {
    data: rawLogs,
    isLoading,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['logs'],
    queryFn: () => fetchLogs(),
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  // Enrich each row with the derived `level` + `body` once, so the table
  // doesn't recompute them in every render / sort / filter pass.
  const logs = React.useMemo<LogRow[]>(() => {
    return (rawLogs ?? []).map((row) => {
      const { level, body } = deriveLevel(row.message)
      return { ...row, level, body }
    })
  }, [rawLogs])

  const counts = React.useMemo(() => {
    let error = 0
    let warning = 0
    let info = 0
    for (const log of logs) {
      if (log.level === 'error') error++
      else if (log.level === 'warning') warning++
      else info++
    }
    return { total: logs.length, error, warning, info }
  }, [logs])

  const [levelFilter, setLevelFilter] = React.useState<'all' | LogLevel>('all')
  const filteredLogs = React.useMemo(() => {
    if (levelFilter === 'all') return logs
    return logs.filter((log) => log.level === levelFilter)
  }, [logs, levelFilter])

  // Re-render once per second so the "X ago" label stays fresh without
  // writing to state from an effect.
  useTick(1000)
  const lastRefreshLabel = dataUpdatedAt
    ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true })
    : 'just now'

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
        {/* Hero */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ScrollTextIcon className="size-4" />
              <span className="text-xs uppercase tracking-wide">System</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Activity logs</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Most recent 1,000 entries from{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">public.logs</code>, refreshed
              every {REFRESH_INTERVAL_MS / 1000} seconds.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Last update {lastRefreshLabel}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCwIcon className={cn('size-3.5', isFetching && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total"
            value={counts.total}
            description="Entries currently loaded"
            Icon={ScrollTextIcon}
            accentClassName="text-muted-foreground"
          />
          <StatCard
            title="Errors"
            value={counts.error}
            description="Lines beginning with ERROR:"
            Icon={CircleAlertIcon}
            accentClassName="text-destructive"
          />
          <StatCard
            title="Warnings"
            value={counts.warning}
            description="Lines beginning with WARNING:"
            Icon={AlertTriangleIcon}
            accentClassName="text-amber-500"
          />
          <StatCard
            title="Info"
            value={counts.info}
            description="Everything else"
            Icon={InfoIcon}
            accentClassName="text-muted-foreground"
          />
        </div>

        {/* Filters + table */}
        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Level</span>
              <Select
                value={levelFilter}
                onValueChange={(v) => setLevelFilter(v as 'all' | LogLevel)}
              >
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="error">Errors only</SelectItem>
                  <SelectItem value="warning">Warnings only</SelectItem>
                  <SelectItem value="info">Info only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground">
              Showing {filteredLogs.length.toLocaleString()} of {counts.total.toLocaleString()}{' '}
              entries
            </div>
          </div>
          <div className="px-2 sm:px-4">
            <DataTable
              data={filteredLogs}
              columns={columns}
              isLoading={isLoading}
              showSelectColumn={false}
              searchableColumns={['body']}
              defaultSort={[{ id: 'created_at', desc: true }]}
              emptyState={{
                title: 'No log entries yet',
                subtitle:
                  'Run the my-app worker, or call logger.info(...) from anywhere on the server to populate this view.',
              }}
            />
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
}

export const Route = createFileRoute('/_authenticated/_app/activity-logs/')({
  component: LogsPage,
})
