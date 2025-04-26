import { Separator } from '~/lib/components/ui/separator'
import { AccountForm } from './-components/account-form'
import { createFileRoute } from '@tanstack/react-router'

const SettingsAccountPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings. Set your preferred language and timezone.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/_app/settings/account/')({
  component: SettingsAccountPage,
})
