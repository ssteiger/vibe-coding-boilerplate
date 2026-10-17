import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import { type CurrentUser, getCurrentUser } from '~/lib/auth/server'
import { BOOT_SCRIPT } from '~/lib/preferences'
import appCss from '~/lib/styles/app.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  user: CurrentUser | null
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery({
      queryKey: ['user'],
      queryFn: () => getCurrentUser(),
      staleTime: 30_000,
    })
    return { user }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Boilerplate',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ScriptOnce>{BOOT_SCRIPT}</ScriptOnce>

        {children}

        <Scripts />
      </body>
    </html>
  )
}
