'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md px-4 pb-4">
      <div className="glass-strong flex items-center justify-around rounded-3xl px-2 py-2.5 shadow-2xl">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-2xl bg-primary/12"
                  style={{ boxShadow: '0 0 24px -6px var(--aura-violet)' }}
                />
              )}
              <Icon
                className={cn(
                  'relative h-5 w-5 transition-transform',
                  active && 'scale-110',
                )}
                strokeWidth={active ? 2.4 : 2}
              />
              <span className="relative text-[10px] font-medium tracking-wide">
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
