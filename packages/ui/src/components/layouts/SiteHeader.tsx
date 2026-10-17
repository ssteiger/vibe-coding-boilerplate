import type { ReactNode } from 'react'

import { Separator } from '../ui/Separator'
import { SidebarTrigger } from '../ui/Sidebar'
import { ThemeToggle } from '../ui/ThemeToggle'

export interface SiteHeaderProps {
  /** Title rendered next to the sidebar trigger. */
  title?: ReactNode
  /** Optional content rendered between title and the right-side actions. */
  children?: ReactNode
  /** Centred in the header, whatever the width of the title and actions. */
  center?: ReactNode
  /** Right-side actions. Defaults to a theme toggle. */
  actions?: ReactNode
  /** Hide the default theme toggle when true. */
  hideThemeToggle?: boolean
  /** After the theme toggle, at the very right. */
  end?: ReactNode
}

export function SiteHeader({
  title,
  children,
  center,
  actions,
  hideThemeToggle,
  end,
}: SiteHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 relative flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        {title ? <h1 className="text-sm font-medium">{title}</h1> : null}
        {children}
        {/*
         * Absolute, so the centre sits on the middle of the header rather than
         * between its neighbours, whose widths differ from page to page. Too
         * narrow to share the row below sm, where it steps aside.
         */}
        {center ? (
          <div className="pointer-events-none absolute inset-x-0 hidden justify-center px-4 sm:flex">
            <div className="pointer-events-auto w-full max-w-md lg:max-w-xl">{center}</div>
          </div>
        ) : null}
        <div className="relative ml-auto flex items-center gap-2">
          {actions}
          {hideThemeToggle ? null : <ThemeToggle />}
          {end}
        </div>
      </div>
    </header>
  )
}
