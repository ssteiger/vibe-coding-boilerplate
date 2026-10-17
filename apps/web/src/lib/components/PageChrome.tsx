import { CatchBoundary } from '@tanstack/react-router'
import { Alert, AlertDescription, AlertTitle, Button, cn } from '@vibe-coding-boilerplate/ui'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCwIcon, TriangleAlertIcon } from 'lucide-react'
import * as React from 'react'

/** A number that changes every `intervalMs`, so relative times re-render. */
export function useTick(intervalMs: number): number {
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

/** Title row shared by every page. */
export function PageHeader({
  title,
  description,
  updatedAt,
  isFetching,
  onRefresh,
  actions,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  updatedAt?: string | number | Date | null
  isFetching?: boolean
  onRefresh?: () => void
  actions?: React.ReactNode
  className?: string
}) {
  useTick(1000)
  const updatedLabel = updatedAt
    ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true })
    : null
  return (
    <div
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="max-w-3xl">
        <h1 className="text-2xl font-medium">{title}</h1>
        {description ? <p className="mt-2 text-base text-muted-foreground">{description}</p> : null}
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        {updatedLabel ? <span className="hidden sm:inline">Updated {updatedLabel}</span> : null}
        {actions}
        {onRefresh ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCwIcon className={cn('size-3.5', isFetching && 'animate-spin')} />
            Refresh
          </Button>
        ) : null}
      </div>
    </div>
  )
}

/**
 * A part of a page that fails to render says so in its place while the rest
 * of the page stays. A new `resetKey` (say, when fresh data lands) tries again.
 */
export function SectionBoundary({
  name,
  resetKey = '',
  children,
}: {
  name: string
  resetKey?: string | number
  children: React.ReactNode
}) {
  return (
    <CatchBoundary
      getResetKey={() => resetKey}
      errorComponent={({ error, reset }) => (
        <Alert>
          <TriangleAlertIcon className="size-4" />
          <AlertTitle>{name} could not be shown</AlertTitle>
          <AlertDescription>
            <p>
              Something went wrong in this part of the page: “{error.message}”. The rest of the page
              is unaffected.
            </p>
            <Button size="sm" variant="outline" className="mt-2" onClick={reset}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}
    >
      {children}
    </CatchBoundary>
  )
}

export function EmptyState({
  title,
  children,
  className,
}: {
  title: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-xl border border-dashed p-10 text-center', className)}>
      <div className="font-medium">{title}</div>
      {children ? <div className="mt-1 text-sm text-muted-foreground">{children}</div> : null}
    </div>
  )
}
