'use client'

import { useState } from 'react'
import { categories } from '@/lib/wallpapers'
import { cn } from '@/lib/utils'

export function CategoryPills() {
  const [active, setActive] = useState<string>('Todos')
  const all = ['Todos', ...categories.map((c) => c.name)]

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-1">
      {all.map((name) => {
        const isActive = active === name
        return (
          <button
            key={name}
            type="button"
            onClick={() => setActive(name)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
              isActive
                ? 'bg-primary text-primary-foreground aura-ring'
                : 'glass text-muted-foreground hover:text-foreground',
            )}
          >
            {name}
          </button>
        )
      })}
    </div>
  )
}
