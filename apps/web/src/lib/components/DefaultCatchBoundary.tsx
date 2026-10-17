import {
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import { Button } from '@vibe-coding-boilerplate/ui'
import { TriangleAlertIcon } from 'lucide-react'

/**
 * A page that fails to render. It says what went wrong in place of the page;
 * the sidebar and the other pages still work.
 */
export function DefaultCatchBoundary({ error, reset }: Readonly<ErrorComponentProps>) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error(error)
  const message = error instanceof Error ? error.message : String(error)

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-5 p-6">
      <div className="flex max-w-xl flex-col items-center gap-2 text-center">
        <TriangleAlertIcon className="size-6 text-destructive" />
        <h1 className="text-xl font-medium">This page could not be shown</h1>
        <p className="text-muted-foreground">
          {isRoot
            ? 'The app hit an error before it could start.'
            : 'Something went wrong while showing this page. The other pages still work.'}
        </p>
      </div>
      <pre className="max-h-48 w-full max-w-xl overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
        {message}
      </pre>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          type="button"
          onClick={() => {
            reset()
            void router.invalidate()
          }}
        >
          Try again
        </Button>
        {isRoot ? (
          <Button asChild variant="secondary" size="sm">
            <Link to="/">Home</Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" size="sm">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault()
                window.history.back()
              }}
            >
              Go back
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
