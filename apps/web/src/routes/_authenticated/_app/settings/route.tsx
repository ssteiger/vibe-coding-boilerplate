import { Outlet, createFileRoute } from '@tanstack/react-router'
import { SlidersHorizontalIcon, UserIcon } from 'lucide-react'

import { PageHeader } from '~/lib/components/PageChrome'
import { type SettingsNavItem, SidebarNav } from './-components/SidebarNav'

const SECTIONS: SettingsNavItem[] = [
  {
    href: '/settings',
    title: 'General',
    hint: 'Theme, text size, motion',
    icon: SlidersHorizontalIcon,
  },
  {
    href: '/settings/account',
    title: 'Account',
    hint: 'Sign-in and saved choices',
    icon: UserIcon,
  },
]

function SettingsLayout() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      <PageHeader title="Settings" description="How the app looks and who is signed in." />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="lg:sticky lg:top-4 lg:w-60 lg:shrink-0">
          <SidebarNav items={SECTIONS} />
        </aside>
        <div className="flex min-w-0 max-w-3xl flex-1 flex-col gap-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/_app/settings')({
  component: SettingsLayout,
})
