import { SparklesIcon } from 'lucide-react'

import { useAssistant } from './AssistantProvider'

/** Sits next to the search in the header and opens the assistant sidebar (⌘J). */
export function AssistantBar() {
  const { setOpen } = useAssistant()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Ask the assistant"
      className="flex h-8 shrink-0 items-center gap-2 rounded-md border bg-background/60 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60"
    >
      <SparklesIcon className="size-4 shrink-0" />
      <span className="hidden whitespace-nowrap lg:inline">Ask…</span>
      <kbd className="hidden h-5 min-w-5 items-center justify-center rounded border bg-muted px-1 font-sans text-[11px] font-medium md:inline-flex">
        ⌘J
      </kbd>
    </button>
  )
}
