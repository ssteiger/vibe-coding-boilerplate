import { useQuery } from '@tanstack/react-query'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Textarea,
} from '@vibe-coding-boilerplate/ui'
import {
  ArrowUpIcon,
  CornerDownRightIcon,
  Loader2Icon,
  SparklesIcon,
  SquarePenIcon,
} from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { type ChatTurn, useAssistant } from './AssistantProvider'
import { ReplyText } from './ReplyText'
import { getAssistantStatus } from './server'

const EXAMPLES = [
  'What can I do in this app?',
  'How do I change the theme?',
  'Where do I find the activity logs?',
]

export function AssistantPanel() {
  const { open, setOpen, turns, asking, ask, reset } = useAssistant()
  const status = useQuery({
    queryKey: ['assistant', 'status'],
    queryFn: () => getAssistantStatus(),
    enabled: open,
    staleTime: Number.POSITIVE_INFINITY,
  })
  const [draft, setDraft] = React.useState('')
  const input = React.useRef<HTMLTextAreaElement>(null)
  const bottom = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (open && (turns.length || asking)) bottom.current?.scrollIntoView({ block: 'end' })
  }, [open, turns.length, asking])

  const send = (question: string) => {
    const text = question.trim()
    if (!text || asking) return
    setDraft('')
    ask(text).catch((error: Error) => {
      setDraft(text)
      toast.error(error.message)
    })
  }

  const enabled = status.data?.enabled ?? false

  // The box is disabled until the model status arrives, so focus it once it can take focus.
  React.useEffect(() => {
    if (open && enabled) input.current?.focus()
  }, [open, enabled])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full gap-0 p-0 sm:max-w-lg"
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          input.current?.focus()
        }}
      >
        <SheetHeader className="h-12 shrink-0 flex-row items-center gap-2 border-b py-0 pr-12 pl-4">
          <SheetTitle className="flex items-center gap-2 text-sm">
            <SparklesIcon className="size-4 text-muted-foreground" />
            Assistant
          </SheetTitle>
          <SheetDescription className="sr-only">
            A language model answers questions about the app.
          </SheetDescription>
          {turns.length ? (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-muted-foreground hover:text-foreground"
              onClick={reset}
              disabled={asking}
            >
              <SquarePenIcon className="size-3.5" />
              New conversation
            </Button>
          ) : null}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {status.isPending ? (
            <Skeleton className="h-24 rounded-lg" />
          ) : !enabled ? (
            <NotConfigured />
          ) : turns.length || asking ? (
            <ol className="flex flex-col gap-5 text-sm leading-relaxed">
              {turns.map((turn) => (
                <Turn key={turn.id} turn={turn} />
              ))}
              {asking ? (
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Thinking…
                </li>
              ) : null}
            </ol>
          ) : (
            <Intro onPick={send} />
          )}
          <div ref={bottom} />
        </div>

        <form
          className="shrink-0 p-3 pt-0"
          onSubmit={(event) => {
            event.preventDefault()
            send(draft)
          }}
        >
          <div className="rounded-xl border bg-card transition-[border-color,box-shadow] focus-within:border-ring/60 focus-within:ring-[3px] focus-within:ring-ring/20">
            <Textarea
              ref={input}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  send(draft)
                }
              }}
              placeholder={turns.length ? 'Ask something else…' : 'How do I…'}
              maxLength={1000}
              rows={2}
              className="max-h-40 min-h-11 resize-none border-0 bg-transparent px-3 pt-2.5 pb-1 text-sm focus-visible:ring-0 dark:bg-transparent"
              disabled={!enabled}
              aria-label="Question for the assistant"
            />
            <div className="flex items-center gap-2 pr-2 pb-2 pl-3">
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {status.data?.model ?? ''}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                ↵ to send, ⇧↵ for a new line
              </span>
              <Button
                type="submit"
                size="icon"
                className="size-7 rounded-lg"
                disabled={!enabled || asking || !draft.trim()}
                aria-label="Ask"
              >
                {asking ? (
                  <Loader2Icon className="size-3.5 animate-spin" />
                ) : (
                  <ArrowUpIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function Intro({ onPick }: { onPick: (question: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-sm">
        <span className="flex size-8 items-center justify-center rounded-lg border bg-muted/50">
          <SparklesIcon className="size-4 text-muted-foreground" />
        </span>
        <p className="mt-1">Ask how to do something, or about anything in the app.</p>
        <p className="text-muted-foreground">
          A language model answers. It can be wrong, so check what matters.
        </p>
      </div>
      <div className="flex flex-col">
        <p className="px-2 pb-1 text-xs text-muted-foreground">For example</p>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onPick(example)}
            className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
          >
            <CornerDownRightIcon className="size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}

function Turn({ turn }: { turn: ChatTurn }) {
  if (turn.role === 'user')
    return (
      <li className="max-w-[85%] self-end rounded-xl bg-secondary px-3 py-2 whitespace-pre-line">
        {turn.text}
      </li>
    )
  return (
    <li className="flex flex-col gap-3 self-stretch">
      {turn.parts.map((part, i) => {
        // Parts of one reply never reorder, so their position is a stable key.
        const key = i
        if (part.kind === 'text') return <ReplyText key={key} text={part.text} />
        return (
          <pre
            key={key}
            className="overflow-x-auto rounded-lg border bg-muted/40 p-3 font-mono text-xs whitespace-pre"
          >
            {part.text}
          </pre>
        )
      })}
    </li>
  )
}

function NotConfigured() {
  const variables: [string, string][] = [
    ['AI_PROVIDER', 'openai, anthropic or cursor'],
    [
      'AI_API_KEY',
      "the provider's API key; for cursor, a key from cursor.com/dashboard → Integrations",
    ],
    ['AI_MODEL', 'optional; defaults to a small, fast model'],
    ['AI_BASE_URL', 'optional; for a local server such as Ollama or LM Studio'],
  ]
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p className="font-medium">No language model is set up yet.</p>
      <p className="text-muted-foreground">
        Add these to{' '}
        <code className="rounded border bg-muted/60 px-1 py-px font-mono text-xs">
          apps/web/.env
        </code>{' '}
        and restart the web app.
      </p>
      <dl className="flex flex-col divide-y rounded-lg border">
        {variables.map(([name, what]) => (
          <div key={name} className="flex flex-col gap-0.5 px-3 py-2">
            <dt>
              <code className="font-mono text-xs">{name}</code>
            </dt>
            <dd className="text-muted-foreground">{what}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
