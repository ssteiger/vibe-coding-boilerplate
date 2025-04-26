import { DisplayForm } from './-components/display-form'
import { Separator } from '~/lib/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'

const SettingsDisplayPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Display</h3>
        <p className="text-sm text-muted-foreground">
          Turn items on or off to control what&apos;s displayed in the app.
        </p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/_app/settings/display/')({
  component: SettingsDisplayPage,
})
