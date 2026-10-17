import { Skeleton } from '@vibe-coding-boilerplate/ui'

/** A page still on its way, once it has taken longer than the router's pending delay. */
export function DefaultPending() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-64 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-64" />
    </div>
  )
}
