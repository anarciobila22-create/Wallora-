'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { WallpaperCard } from '@/components/wallpaper-card'
import { categories, type Wallpaper } from '@/lib/wallpapers'
import { cn } from '@/lib/utils'

export function SearchView({ wallpapers }: { wallpapers: Wallpaper[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('Todos')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return wallpapers.filter((w) => {
      const matchCat = category === 'Todos' || w.category === category
      const matchQuery =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.author.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [query, category, wallpapers])

  const chips = ['Todos', ...categories.map((c) => c.name)]

  return (
    <div>
      <header className="px-5 pb-2 pt-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Explorar
        </h1>
        <p className="text-sm text-muted-foreground">
          Encontra a tua aura perfeita
        </p>
      </header>

      {/* Search input */}
      <div className="sticky top-0 z-20 bg-background/60 px-5 py-3 backdrop-blur-md">
        <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Procurar wallpapers..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpar pesquisa"
              className="text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-1">
        {chips.map((name) => {
          const active = category === name
          return (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all',
                active
                  ? 'bg-primary text-primary-foreground aura-ring'
                  : 'glass text-muted-foreground',
              )}
            >
              {name}
            </button>
          )
        })}
      </div>

      {/* Results grid */}
      <div className="px-5 py-4">
        <p className="mb-3 text-xs text-muted-foreground">
          {results.length} resultado{results.length === 1 ? '' : 's'}
        </p>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {results.map((w, i) => (
              <WallpaperCard key={w.id} wallpaper={w} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <p className="font-display text-lg font-semibold">Sem resultados</p>
            <p className="text-sm text-muted-foreground">
              Tenta outra pesquisa ou categoria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
