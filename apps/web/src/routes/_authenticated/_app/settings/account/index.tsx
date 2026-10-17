import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@vibe-coding-boilerplate/ui'
import { format } from 'date-fns'
import { LogOutIcon } from 'lucide-react'
import { toast } from 'sonner'

import { logoutFn } from '~/lib/auth/server'
import { resetPreferences } from '~/lib/preferences'
import { SettingRow, SettingsSection } from '../-components/SettingsSection'

function AccountSettingsPage() {
  const { user } = Route.useRouteContext()
  const client = useQueryClient()

  const signOut = useMutation({
    mutationFn: logoutFn,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => toast.error(`Could not sign out: ${error.message}`),
  })

  return (
    <>
      <SettingsSection
        title="Signed in"
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={() => signOut.mutate(undefined)}
            disabled={signOut.isPending}
            className="gap-1.5"
          >
            <LogOutIcon className="size-3.5" />
            Sign out
          </Button>
        }
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">Email</dt>
            <dd className="text-sm break-all">{user?.email ?? '—'}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">Member since</dt>
            <dd className="text-sm">
              {user?.created_at ? format(new Date(user.created_at), 'd MMMM yyyy') : '—'}
            </dd>
          </div>
        </dl>
      </SettingsSection>

      <SettingsSection title="Saved in this browser">
        <SettingRow
          label="Display choices"
          description="Theme, text size and motion. They live in this browser only."
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              resetPreferences()
              toast.success('Back to the defaults.')
            }}
          >
            Reset to defaults
          </Button>
        </SettingRow>
      </SettingsSection>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/_app/settings/account/')({
  component: AccountSettingsPage,
})
