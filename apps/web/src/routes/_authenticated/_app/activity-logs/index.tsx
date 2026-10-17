import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { ColumnDef } from '@tanstack/react-table'
import { postgres_db, schema } from '@vibe-coding-boilerplate/db-drizzle'
import {
  Badge,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stat,
  StatTitle,
  StatValue,
  Stats,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from '@vibe-coding-boilerplate/ui'
import { format, formatDistanceToNow } from 'date-fns'
import { desc } from 'drizzle-orm'
import { AlertTriangleIcon, CircleAlertIcon, InfoIcon, ScrollTextIcon } from 'lucide-react'
import * as React from 'react'

import { EmptyState, PageHeader } from '~/lib/components/PageChrome'
import { requireSignedInUser } from '~/lib/utils/supabase/server'

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
  await requireSignedInUser()
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

  const stats = [
    { title: 'Total', value: counts.total, hint: 'Entries currently loaded', Icon: ScrollTextIcon },
    {
      title: 'Errors',
      value: counts.error,
      hint: 'Lines beginning with ERROR:',
      Icon: CircleAlertIcon,
      accent: 'text-destructive',
    },
    {
      title: 'Warnings',
      value: counts.warning,
      hint: 'Lines beginning with WARNING:',
      Icon: AlertTriangleIcon,
      accent: 'text-amber-500',
    },
    { title: 'Info', value: counts.info, hint: 'Everything else', Icon: InfoIcon },
  ]

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          className="shrink-0 border-b p-4"
          title="Activity logs"
          description={
            <>
              The newest 1,000 lines from{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">public.logs</code>, refreshed
              every {REFRESH_INTERVAL_MS / 1000} seconds.
            </>
          }
          updatedAt={dataUpdatedAt || null}
          isFetching={isFetching}
          onRefresh={() => refetch()}
        />

        <Stats isLoading={isLoading}>
          {stats.map(({ title, value, hint, Icon, accent }) => (
            <Stat key={title}>
              <StatTitle tooltip={hint}>{title}</StatTitle>
              <StatValue>
                <Icon className={cn('size-5 text-muted-foreground', accent)} />
                {value.toLocaleString()}
              </StatValue>
            </Stat>
          ))}
        </Stats>

        {!isLoading && !logs.length ? (
          <EmptyState title="Nothing has been logged yet" className="m-4">
            Run the my-app worker, or call <code>logger.info(...)</code> from anywhere on the
            server, and the lines show up here.
          </EmptyState>
        ) : (
          <DataTable
            fill
            data={filteredLogs}
            columns={columns}
            isLoading={isLoading}
            showSelectColumn={false}
            showActionsColumn={false}
            defaultSort={[{ id: 'created_at', desc: true }]}
            toolbar={
              <Select
                value={levelFilter}
                onValueChange={(v) => setLevelFilter(v as 'all' | LogLevel)}
              >
                <SelectTrigger className="w-35" aria-label="Level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="error">Errors only</SelectItem>
                  <SelectItem value="warning">Warnings only</SelectItem>
                  <SelectItem value="info">Info only</SelectItem>
                </SelectContent>
              </Select>
            }
            emptyState={{
              title: 'Nothing matches',
              subtitle: 'Try another level or search.',
            }}
          />
        )}
      </div>
    </TooltipProvider>
  )
}

export const Route = createFileRoute('/_authenticated/_app/activity-logs/')({
  component: LogsPage,
})
