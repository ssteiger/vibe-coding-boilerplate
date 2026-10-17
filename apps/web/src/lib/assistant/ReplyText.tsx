import type * as React from 'react'

/*
 * Just enough formatting for the assistant's replies: paragraphs, numbered
 * and bulleted lists, **bold** and `code`. Headings become bold paragraphs.
 */

type Block =
  | { kind: 'p'; lines: string[] }
  | { kind: 'ol'; start: number; items: string[] }
  | { kind: 'ul'; items: string[] }

const ORDERED = /^(\d+)[.)]\s+(.*)$/
const BULLET = /^[-*•]\s+(.*)$/
const HEADING = /^#{1,6}\s+(.*)$/

function blocks(text: string): Block[] {
  const out: Block[] = []
  let current: Block | null = null
  const flush = () => {
    if (current) out.push(current)
    current = null
  }
  for (const rawLine of text.split('\n')) {
    const indented = /^\s{2,}\S/.test(rawLine)
    const line = rawLine.trim()
    if (!line) {
      flush()
      continue
    }
    const ordered = ORDERED.exec(line)
    const bullet = BULLET.exec(line)
    const heading = HEADING.exec(line)
    if (ordered) {
      if (current?.kind !== 'ol') {
        flush()
        current = { kind: 'ol', start: Number(ordered[1]), items: [] }
      }
      current.items.push(ordered[2])
    } else if (bullet && !(indented && current?.kind === 'ol')) {
      if (current?.kind !== 'ul') {
        flush()
        current = { kind: 'ul', items: [] }
      }
      current.items.push(bullet[1])
    } else if (current && current.kind !== 'p' && (indented || bullet)) {
      // A continuation of the last list item.
      const last = current.items.length - 1
      current.items[last] = `${current.items[last]} ${bullet ? bullet[1] : line}`
    } else if (heading) {
      flush()
      out.push({ kind: 'p', lines: [`**${heading[1].replace(/\*\*/g, '')}**`] })
    } else {
      if (current?.kind !== 'p') {
        flush()
        current = { kind: 'p', lines: [] }
      }
      current.lines.push(line)
    }
  }
  flush()
  return out
}

function Inline({ text }: { text: string }) {
  const pieces = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return (
    <>
      {pieces.map((piece, i) => {
        // Pieces of one line never reorder.
        if (piece.startsWith('**') && piece.endsWith('**') && piece.length > 4)
          return (
            <strong
              // biome-ignore lint/suspicious/noArrayIndexKey: see above
              key={i}
              className="font-semibold"
            >
              {piece.slice(2, -2)}
            </strong>
          )
        if (piece.startsWith('`') && piece.endsWith('`') && piece.length > 2)
          return (
            <code
              // biome-ignore lint/suspicious/noArrayIndexKey: see above
              key={i}
              className="rounded border bg-muted/60 px-1 py-px font-mono text-[0.85em]"
            >
              {piece.slice(1, -1)}
            </code>
          )
        return piece
      })}
    </>
  )
}

export function ReplyText({ text }: { text: string }): React.ReactNode {
  return (
    <div className="flex flex-col gap-3">
      {blocks(text).map((block, i) => {
        // Blocks of one reply never reorder.
        if (block.kind === 'p')
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: see above
            <p key={i}>
              {block.lines.map((line, j) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: see above
                <span key={j}>
                  {j > 0 ? <br /> : null}
                  <Inline text={line} />
                </span>
              ))}
            </p>
          )
        const items = block.items.map((item, j) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: see above
          <li key={j}>
            <Inline text={item} />
          </li>
        ))
        return block.kind === 'ol' ? (
          <ol
            // biome-ignore lint/suspicious/noArrayIndexKey: see above
            key={i}
            start={block.start}
            className="flex list-decimal flex-col gap-1.5 pl-5 marker:text-muted-foreground"
          >
            {items}
          </ol>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: see above
          <ul key={i} className="flex list-disc flex-col gap-1.5 pl-5 marker:text-muted-foreground">
            {items}
          </ul>
        )
      })}
    </div>
  )
}
