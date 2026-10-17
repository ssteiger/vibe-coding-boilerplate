import * as React from 'react'

import { cn } from '../../utils/cn'
import { Skeleton } from './Skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

const COLUMNS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
  5: 'md:grid-cols-3 lg:grid-cols-5',
  6: 'md:grid-cols-3 lg:grid-cols-6',
  7: 'md:grid-cols-4 lg:grid-cols-7',
  8: 'md:grid-cols-4 lg:grid-cols-8',
}

const StatContext = React.createContext<{ isLoading?: boolean }>({})

/** A full-width strip of stats divided by hairlines, for edge-to-edge pages rather than cards. */
function Stats({
  className,
  children,
  isLoading,
  ...props
}: React.ComponentProps<'div'> & { isLoading?: boolean }) {
  const count = React.Children.count(children)
  return (
    <StatContext.Provider value={{ isLoading }}>
      <div
        data-slot="stats"
        className={cn(
          'grid shrink-0 grid-cols-1 overflow-hidden border-b sm:grid-cols-2',
          COLUMNS[count],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </StatContext.Provider>
  )
}

function Stat({
  className,
  children,
  isLoading,
  ...props
}: React.ComponentProps<'div'> & { isLoading?: boolean }) {
  const parent = React.useContext(StatContext)
  return (
    <StatContext.Provider value={{ isLoading: isLoading ?? parent.isLoading }}>
      <div
        data-slot="stat"
        className={cn(
          // Right and bottom hairlines; the strip's overflow clips the ones on its outer edges.
          'flex flex-col justify-between gap-2 p-4 shadow-[1px_0_0_var(--color-border),0_1px_0_var(--color-border)]',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </StatContext.Provider>
  )
}

function StatTitle({
  className,
  children,
  tooltip,
  ...props
}: React.ComponentProps<'div'> & { tooltip?: React.ReactNode }) {
  const title = (
    <div
      data-slot="stat-title"
      className={cn(
        'w-fit text-sm text-muted-foreground',
        tooltip && 'cursor-default underline decoration-dotted underline-offset-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
  if (!tooltip) return title
  return (
    <Tooltip>
      <TooltipTrigger asChild>{title}</TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-64">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

function StatValue({ className, children, ...props }: React.ComponentProps<'div'>) {
  const { isLoading } = React.useContext(StatContext)
  if (isLoading) return <Skeleton className="h-7 w-20" />
  return (
    <div
      data-slot="stat-value"
      className={cn('flex items-center gap-2 text-2xl leading-7 tabular-nums', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function StatDescription({ className, children, ...props }: React.ComponentProps<'p'>) {
  const { isLoading } = React.useContext(StatContext)
  if (isLoading) return <Skeleton className="h-4 w-32" />
  return (
    <p
      data-slot="stat-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export { Stat, StatDescription, Stats, StatTitle, StatValue }
