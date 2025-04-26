import { Separator } from '~/lib/components/ui/separator'
import { NotificationsForm } from './-components/notifications-form'
import { createFileRoute } from '@tanstack/react-router'

const SettingsNotificationsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/_app/settings/notifications/')({
  component: SettingsNotificationsPage,
})
