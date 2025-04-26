import { Outlet, createFileRoute } from '@tanstack/react-router'
import { AppSidebar } from '~/lib/components/ui/app-sidebar'
import { SidebarInset, SidebarProvider } from '~/lib/components/ui/sidebar'
import { SiteHeader } from '~/lib/components/ui/site-header'
import { Toaster } from '~/lib/components/ui/sonner'

const Layout = () => {
  return (
    <SidebarProvider>
      <Toaster position="top-right" />

      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const Route = createFileRoute('/_authenticated/_app')({
  component: Layout,
})
