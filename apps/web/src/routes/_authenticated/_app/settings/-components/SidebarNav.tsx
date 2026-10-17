import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@vibe-coding-boilerplate/ui'
import type { LucideIcon } from 'lucide-react'

export interface SettingsNavItem {
  href: string
  title: string
  hint: string
  icon: LucideIcon
}

export function SidebarNav({ items }: { items: SettingsNavItem[] }) {
  const pathname = useLocation({ select: (l) => l.pathname.replace(/\/+$/, '') })
  return (
    <nav
      aria-label="Settings sections"
      className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
    >
      {items.map(({ href, title, hint, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            to={href}
            activeOptions={{ exact: true }}
            className={cn(
              'flex shrink-0 items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50',
            )}
          >
            <Icon className={cn('mt-0.5 size-4 shrink-0', active && 'text-primary')} />
            <span className="flex flex-col">
              <span className="font-medium text-foreground">{title}</span>
              <span className="hidden text-xs lg:block">{hint}</span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
