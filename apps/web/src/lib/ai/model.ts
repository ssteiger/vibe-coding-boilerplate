/**
 * The optional language model behind the assistant and anything else that
 * wants one. Configured through environment variables only; server-side only.
 */

export type ModelProvider = 'openai' | 'anthropic' | 'cursor'

export interface ModelConfig {
  provider: ModelProvider
  apiKey: string
  model: string
  /** API root; lets an OpenAI-compatible local server (Ollama, LM Studio) stand in. Unused for cursor. */
  baseUrl: string
}

const DEFAULT_MODEL: Record<ModelProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-haiku-latest',
  cursor: 'composer-2.5',
}

const DEFAULT_BASE_URL: Record<ModelProvider, string> = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  cursor: '',
}

function isProvider(value: string): value is ModelProvider {
  return value === 'openai' || value === 'anthropic' || value === 'cursor'
}

export function readModelConfig(): ModelConfig | null {
  const provider = (process.env.AI_PROVIDER ?? '').trim().toLowerCase()
  if (!isProvider(provider)) return null
  const apiKey = (
    process.env.AI_API_KEY ||
    (provider === 'cursor' ? process.env.CURSOR_API_KEY : '') ||
    ''
  ).trim()
  if (!apiKey) return null
  const model = (process.env.AI_MODEL ?? '').trim() || DEFAULT_MODEL[provider]
  const baseUrl = ((process.env.AI_BASE_URL ?? '').trim() || DEFAULT_BASE_URL[provider]).replace(
    /\/+$/,
    '',
  )
  return { provider, apiKey, model, baseUrl }
}

export interface CompletionRequest {
  system: string
  user: string
  temperature: number
  maxTokens: number
  timeoutMs?: number
}

/**
 * Where Cursor agents run: an empty folder, because a local agent loads rules
 * and skills from its folder and the repo's own must not reach the model, and
 * a folder of JSONL files for the agent's state, because the SDK's default
 * store needs node:sqlite, which older Node versions only have behind a flag.
 */
async function cursorFolders(): Promise<{ workspace: string; store: string }> {
  const [{ mkdir }, os, path] = await Promise.all([
    import('node:fs/promises'),
    import('node:os'),
    import('node:path'),
  ])
  const root = path.join(os.tmpdir(), 'vibe-coding-boilerplate-model')
  const workspace = path.join(root, 'workspace')
  const store = path.join(root, 'agents')
  await Promise.all([mkdir(workspace, { recursive: true }), mkdir(store, { recursive: true })])
  return { workspace, store }
}

/**
 * A Cursor agent with no tools, so it can only answer in text. The
 * instructions travel in the message: replacing the agent's system prompt
 * is not open to every key.
 */
async function completeWithCursor(
  config: ModelConfig,
  request: CompletionRequest,
): Promise<string> {
  const [{ Agent, JsonlLocalAgentStore }, folders] = await Promise.all([
    import('@cursor/sdk'),
    cursorFolders(),
  ])
  const agent = await Agent.create({
    apiKey: config.apiKey,
    model: { id: config.model },
    tools: [],
    local: { cwd: folders.workspace, store: new JsonlLocalAgentStore(folders.store) },
  })
  try {
    const run = await agent.send(`${request.system}\n\n---\n\n${request.user}`)
    const timer = setTimeout(() => {
      run.cancel().catch(() => {})
    }, request.timeoutMs ?? 60_000)
    try {
      const result = await run.wait()
      if (result.status === 'cancelled') throw new Error('The model took too long to answer.')
      if (result.status !== 'finished')
        throw new Error(`The Cursor agent failed: ${result.error?.message ?? 'no reason given'}`)
      const text = result.result?.trim()
      if (!text) throw new Error('The model returned nothing.')
      return text
    } finally {
      clearTimeout(timer)
    }
  } finally {
    await agent[Symbol.asyncDispose]()
  }
}

export async function complete(config: ModelConfig, request: CompletionRequest): Promise<string> {
  if (config.provider === 'cursor') return completeWithCursor(config, request)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), request.timeoutMs ?? 60_000)
  try {
    if (config.provider === 'openai') {
      const res = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          temperature: request.temperature,
          max_tokens: request.maxTokens,
          messages: [
            { role: 'system', content: request.system },
            { role: 'user', content: request.user },
          ],
        }),
        signal: controller.signal,
      })
      if (!res.ok)
        throw new Error(`The model's provider answered ${res.status}: ${await errorText(res)}`)
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] }
      const text = json.choices?.[0]?.message?.content?.trim()
      if (!text) throw new Error('The model returned nothing.')
      return text
    }
    const res = await fetch(`${config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: request.maxTokens,
        temperature: request.temperature,
        system: request.system,
        messages: [{ role: 'user', content: request.user }],
      }),
      signal: controller.signal,
    })
    if (!res.ok)
      throw new Error(`The model's provider answered ${res.status}: ${await errorText(res)}`)
    const json = (await res.json()) as { content?: { type: string; text?: string }[] }
    const text = json.content
      ?.filter((c) => c.type === 'text')
      .map((c) => c.text ?? '')
      .join('\n')
      .trim()
    if (!text) throw new Error('The model returned nothing.')
    return text
  } finally {
    clearTimeout(timer)
  }
}

async function errorText(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as { error?: { message?: string } }
    return json.error?.message ?? res.statusText
  } catch {
    return res.statusText
  }
}
