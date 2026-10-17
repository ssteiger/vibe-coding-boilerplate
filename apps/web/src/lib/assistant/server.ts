import { createServerFn } from '@tanstack/react-start'

import { complete, readModelConfig } from '~/lib/ai/model'
import { requireSignedInUser } from '~/lib/utils/supabase/server'

/*
 * Server only: the assistant in the header. It answers with whatever
 * `appContext` tells it about the app, so give it the facts it needs there.
 */

const MAX_QUESTION = 1000
const MAX_TURNS = 8
const MAX_TURN = 3000

const requireUser = () => requireSignedInUser('Sign in to ask the assistant')

// ---------------------------------------------------------------------------
// Status

export interface AssistantStatus {
  enabled: boolean
  model: string | null
}

export const getAssistantStatus = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AssistantStatus> => {
    await requireUser()
    const config = readModelConfig()
    return { enabled: Boolean(config), model: config?.model ?? null }
  },
)

// ---------------------------------------------------------------------------
// What the model is told

/**
 * Facts about the app and the signed-in user that the model should answer
 * with, one per line. Read them from the database here as the app grows.
 */
async function appContext(user: { email?: string | null }): Promise<string[]> {
  return [`The user is signed in as ${user.email ?? 'an unknown email'}.`]
}

const SYSTEM_PROMPT = [
  'You are the assistant inside a web app. Answer the user clearly and briefly, in plain sentences.',
  'Use numbered steps for anything that takes more than one step, and fenced code blocks for code.',
  'If you do not know something about the app, say so rather than guess.',
].join(' ')

export interface AssistantTurn {
  role: 'user' | 'assistant'
  text: string
}

export type AssistantPart =
  | { kind: 'text'; text: string }
  | { kind: 'code'; lang: string; text: string }

export interface AssistantReply {
  /** The reply as the model wrote it; sent back as history with the next question. */
  raw: string
  parts: AssistantPart[]
  model: string
}

/** Prose around fenced code blocks. */
function splitReply(raw: string): AssistantPart[] {
  const parts: AssistantPart[] = []
  const fence = /```([\w-]*)[^\n]*\n([\s\S]*?)```/g
  let last = 0
  const pushText = (text: string) => {
    const trimmed = text.trim()
    if (trimmed) parts.push({ kind: 'text', text: trimmed })
  }
  for (const match of raw.matchAll(fence)) {
    pushText(raw.slice(last, match.index))
    last = (match.index ?? 0) + match[0].length
    parts.push({ kind: 'code', lang: match[1].toLowerCase(), text: match[2].replace(/\s+$/, '') })
  }
  pushText(raw.slice(last))
  return parts
}

function cleanTurns(turns: AssistantTurn[] | undefined): AssistantTurn[] {
  if (!Array.isArray(turns)) return []
  return turns
    .filter((t) => (t.role === 'user' || t.role === 'assistant') && typeof t.text === 'string')
    .slice(-MAX_TURNS)
    .map((t) => ({ role: t.role, text: t.text.trim().slice(0, MAX_TURN) }))
    .filter((t) => t.text)
}

export const askAssistant = createServerFn({ method: 'POST' })
  .inputValidator((input: { question: string; history?: AssistantTurn[] }) => input)
  .handler(async ({ data }): Promise<AssistantReply> => {
    const user = await requireUser()
    const config = readModelConfig()
    if (!config) throw new Error('No model is configured. Set AI_PROVIDER and AI_API_KEY.')
    const question = (typeof data.question === 'string' ? data.question : '')
      .trim()
      .slice(0, MAX_QUESTION)
    if (!question) throw new Error('Ask something first')
    const history = cleanTurns(data.history)
    const context = await appContext(user)
    const prompt = [
      'About the app:',
      ...context,
      '',
      ...(history.length
        ? [
            'The conversation so far:',
            ...history.map((t) => `${t.role === 'user' ? 'User' : 'Assistant'}: ${t.text}`),
            '',
          ]
        : []),
      `User: ${question}`,
      'Assistant:',
    ].join('\n')
    const raw = (
      await complete(config, {
        system: SYSTEM_PROMPT,
        user: prompt,
        temperature: 0.3,
        maxTokens: 900,
        timeoutMs: 90_000,
      })
    )
      .replace(/^Assistant:\s*/, '')
      .trim()
    return { raw, parts: splitReply(raw), model: config.model }
  })
