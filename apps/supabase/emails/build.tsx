/** @jsxImportSource react */
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { render } from '@react-email/components'

import { Confirmation } from './Confirmation'
import { MagicLink } from './MagicLink'

/*
 * Renders the React Email templates to the static HTML that Supabase sends
 * (see `[auth.email.template.*]` in config.toml). Run `bun run emails:build`
 * after editing an email, then restart Supabase to pick up the change.
 */

const TEMPLATES_DIR = join(import.meta.dir, '..', 'templates')

const emails = [
  { file: 'magic-link.html', element: <MagicLink /> },
  { file: 'confirmation.html', element: <Confirmation /> },
]

for (const { file, element } of emails) {
  const html = await render(element, { pretty: true })
  await writeFile(join(TEMPLATES_DIR, file), html)
  console.log(`wrote templates/${file}`)
}
