import { useNavigate } from '@tanstack/react-router'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@vibe-coding-boilerplate/ui'
import {
  ClipboardListIcon,
  type LucideIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UserIcon,
} from 'lucide-react'
import * as React from 'react'

import { type AppPath, PAGES, rankMatch } from '~/lib/search/model'

/** The icon each page wears in the sidebar or the settings list. */
const PAGE_ICON: Record<AppPath, LucideIcon> = {
  '/activity-logs': ClipboardListIcon,
  '/settings': SlidersHorizontalIcon,
  '/settings/account': UserIcon,
}

/** Pages whose title, purpose or keywords answer the query; the first few when it is empty. */
function matchingPages(q: string) {
  if (!q) return PAGES.slice(0, 8)
  return PAGES.map((page) => ({
    page,
    rank: rankMatch(page.title, `${page.detail} ${page.keywords}`, q),
  }))
    .filter((entry): entry is { page: (typeof PAGES)[number]; rank: number } => entry.rank !== null)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5)
    .map((entry) => entry.page)
}

/** One line of a result: an icon, a name, and what it is. */
function Row({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode
  title: string
  detail?: string | null
}) {
  return (
    <>
      <span className="flex size-6 shrink-0 items-center justify-center">{icon}</span>
      <span className="min-w-0 flex-1 truncate">
        {title}
        {detail ? <span className="ml-2 text-muted-foreground">{detail}</span> : null}
      </span>
    </>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border bg-muted px-1 font-sans text-[11px] font-medium text-muted-foreground">
      {children}
    </kbd>
  )
}

/**
 * Search the app from the header. Opens with ⌘K / Ctrl+K. It searches the
 * pages in `PAGES`; to search data as well, add a server function that
 * returns hits for the query and render them as more `CommandGroup`s.
 */
export function GlobalSearch() {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)
  const [q, setQ] = React.useState('')
  const typed = q.trim()

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const pages = matchingPages(typed)
  const goPage = (to: AppPath) => {
    setOpen(false)
    setQ('')
    navigate({ to })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 w-full items-center gap-2 rounded-md border bg-background/60 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60"
      >
        <SearchIcon className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">Search…</span>
        <Kbd>⌘K</Kbd>
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setQ('')
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="top-[12vh] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-[40rem]"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>Find a page in the app.</DialogDescription>
          </DialogHeader>
          <Command
            shouldFilter={false}
            className="bg-transparent **:data-[slot=command-input-wrapper]:h-14 **:data-[slot=command-input-wrapper]:gap-3 **:data-[slot=command-input-wrapper]:px-4 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group]]:px-2 [&_[cmdk-group]]:py-0 [&_[cmdk-input]]:h-14 [&_[cmdk-input]]:text-[0.9375rem] [&_[cmdk-item]]:h-9 [&_[cmdk-item]]:gap-3 [&_[cmdk-item]]:rounded-md [&_[cmdk-item]]:px-2"
          >
            <CommandInput
              placeholder="Search for a page…"
              value={q}
              onValueChange={setQ}
              aria-label="Search the app"
            />
            <CommandList className="max-h-[min(60vh,34rem)] pb-2">
              {!pages.length ? (
                <CommandEmpty className="py-10 text-muted-foreground">
                  Nothing by that name.
                </CommandEmpty>
              ) : null}

              {pages.length ? (
                <CommandGroup heading="Pages">
                  {pages.map((page) => {
                    const PageIcon = PAGE_ICON[page.to]
                    return (
                      <CommandItem
                        key={page.to}
                        value={`page-${page.to}`}
                        onSelect={() => goPage(page.to)}
                      >
                        <Row
                          icon={<PageIcon className="size-4 text-muted-foreground" />}
                          title={page.title}
                          detail={page.detail}
                        />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
