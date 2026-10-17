import type { ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { SidebarInset, SidebarProvider } from '../ui/Sidebar'
import { Toaster } from '../ui/Sonner'
import { AppSidebar, type AppSidebarProps } from './AppSidebar'
import { SiteHeader, type SiteHeaderProps } from './SiteHeader'

type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface AppLayoutProps {
  children: ReactNode
  /** Override the entire sidebar. When provided, `sidebarProps` is ignored. */
  sidebar?: ReactNode
  /** Props forwarded to the default `<AppSidebar />` when no `sidebar` slot is given. */
  sidebarProps?: AppSidebarProps
  /** Override the entire header. When provided, `headerProps` is ignored. */
  header?: ReactNode
  /** Props forwarded to the default `<SiteHeader />` when no `header` slot is given. */
  headerProps?: SiteHeaderProps
  /** Hide the header altogether. */
  hideHeader?: boolean
  /** Hide the embedded `<Toaster />`. */
  hideToaster?: boolean
  /** Position passed to the embedded toaster. */
  toasterPosition?: ToasterPosition
  /** Default sidebar open state passed to `SidebarProvider`. */
  defaultSidebarOpen?: boolean
}

/**
 * The element that scrolls page content. The header stays put above it, and a
 * page with `min-h-0 flex-1` gets exactly the space left below the header.
 * Pass `#${APP_SCROLL_ID}` to the router's `scrollToTopSelectors`.
 */
export const APP_SCROLL_ID = 'app-scroll'

/**
 * Composed application shell: a `SidebarProvider`, configurable sidebar, header,
 * scrollable content area, and a toaster. Drop a route's `<Outlet />` (or any
 * children) inside it.
 */
export function AppLayout({
  children,
  sidebar,
  sidebarProps,
  header,
  headerProps,
  hideHeader,
  hideToaster,
  toasterPosition = 'top-right',
  defaultSidebarOpen,
}: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen} className="h-svh flex-col">
      {hideToaster ? null : <Toaster position={toasterPosition} />}
      {hideHeader ? null : (header ?? <SiteHeader {...headerProps} />)}
      <div className="flex min-h-0 w-full flex-1">
        {sidebar ?? (
          <AppSidebar
            variant="inset"
            {...sidebarProps}
            // The sidebar is fixed to the viewport; start it below the full-width header.
            className={cn(!hideHeader && 'top-12 h-[calc(100svh-3rem)]', sidebarProps?.className)}
          />
        )}
        <SidebarInset className="min-h-0">
          <div
            id={APP_SCROLL_ID}
            data-scroll-restoration-id={APP_SCROLL_ID}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          >
            <div className="@container/main flex min-h-0 flex-1 flex-col gap-2">{children}</div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
