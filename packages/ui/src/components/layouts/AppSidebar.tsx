import { Link } from '@tanstack/react-router'
import {
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  type LucideIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/Sidebar'
import { NavDocuments } from './NavDocuments'
import { NavMain } from './NavMain'
import { NavSecondary } from './NavSecondary'
import { NavUser, type NavUserMenuItem, type NavUserUser } from './NavUser'

export interface AppSidebarNavItem {
  title: string
  url: string
  icon?: LucideIcon
  /** Highlight when the current path is this URL or a child of it. */
  matchPrefix?: boolean
}

export interface AppSidebarDocumentItem {
  name: string
  url: string
  icon: LucideIcon
}

export interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  /** Brand label rendered in the sidebar header. */
  brand?: ReactNode
  /** URL the brand link navigates to. */
  brandHref?: string
  navMain?: AppSidebarNavItem[]
  navSecondary?: AppSidebarNavItem[]
  documents?: AppSidebarDocumentItem[]
  user?: NavUserUser
  userMenuItems?: NavUserMenuItem[]
  onLogout?: () => void
}

const defaultNavMain: AppSidebarNavItem[] = [
  { title: 'Home', url: '/', icon: LayoutDashboardIcon },
  { title: 'Logs', url: '/activity-logs', icon: ClipboardListIcon },
]

const defaultNavSecondary: AppSidebarNavItem[] = [
  { title: 'Settings', url: '/settings', icon: SettingsIcon },
  { title: 'Get Help', url: '#', icon: HelpCircleIcon },
  { title: 'Search', url: '#', icon: SearchIcon },
]

const defaultDocuments: AppSidebarDocumentItem[] = [
  { name: 'Data Library', url: '#', icon: DatabaseIcon },
  { name: 'Reports', url: '#', icon: ClipboardListIcon },
  { name: 'Word Assistant', url: '#', icon: FileIcon },
]

export function AppSidebar({
  variant = 'inset',
  brand = 'Boilerplate',
  brandHref = '/',
  navMain = defaultNavMain,
  navSecondary = defaultNavSecondary,
  documents = defaultDocuments,
  user,
  userMenuItems,
  onLogout,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar variant={variant} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to={brandHref}>
                <span className="text-base font-semibold">{brand}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navMain.length > 0 ? <NavMain items={navMain} /> : null}
        {documents.length > 0 ? <NavDocuments items={documents} /> : null}
        {navSecondary.length > 0 ? <NavSecondary items={navSecondary} className="mt-auto" /> : null}
      </SidebarContent>
      {user ? (
        <SidebarFooter>
          <NavUser user={user} menuItems={userMenuItems} onLogout={onLogout} />
        </SidebarFooter>
      ) : null}
    </Sidebar>
  )
}
