import { useMutation } from '@tanstack/react-query'
import * as React from 'react'

import { AssistantPanel } from './AssistantPanel'
import { type AssistantPart, type AssistantTurn, askAssistant } from './server'

export type ChatTurn =
  | { id: number; role: 'user'; text: string }
  | { id: number; role: 'assistant'; raw: string; parts: AssistantPart[] }

interface AssistantContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  turns: ChatTurn[]
  asking: boolean
  /** Rejects when the model could not answer; the question is taken back out of the chat. */
  ask: (question: string) => Promise<void>
  reset: () => void
}

const AssistantContext = React.createContext<AssistantContextValue | null>(null)

export function useAssistant(): AssistantContextValue {
  const value = React.useContext(AssistantContext)
  if (!value) throw new Error('useAssistant needs an AssistantProvider')
  return value
}

/**
 * Holds the conversation for the whole app shell, so it survives closing the
 * sidebar and moving between pages, and opens the sidebar with ⌘J / Ctrl+J.
 */
export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [turns, setTurns] = React.useState<ChatTurn[]>([])
  const nextId = React.useRef(1)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (input: { question: string; history: AssistantTurn[] }) =>
      askAssistant({ data: input }),
  })

  const ask = React.useCallback(
    async (question: string) => {
      const history: AssistantTurn[] = turns.map((t) =>
        t.role === 'user' ? { role: 'user', text: t.text } : { role: 'assistant', text: t.raw },
      )
      const id = nextId.current++
      setTurns((prev) => [...prev, { id, role: 'user', text: question }])
      try {
        const reply = await mutateAsync({ question, history })
        setTurns((prev) => [
          ...prev,
          { id: nextId.current++, role: 'assistant', raw: reply.raw, parts: reply.parts },
        ])
      } catch (error) {
        setTurns((prev) => prev.filter((t) => t.id !== id))
        throw error
      }
    },
    [turns, mutateAsync],
  )

  const reset = React.useCallback(() => setTurns([]), [])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const value = React.useMemo(
    () => ({ open, setOpen, turns, asking: isPending, ask, reset }),
    [open, turns, isPending, ask, reset],
  )

  return (
    <AssistantContext.Provider value={value}>
      {children}
      <AssistantPanel />
    </AssistantContext.Provider>
  )
}
