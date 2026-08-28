import { ChevronRight } from 'lucide-react'
import type { Wallpaper } from '@/lib/wallpapers'
import { WallpaperCard } from './wallpaper-card'

export function SectionRail({
  title,
  subtitle,
  wallpapers,
}: {
  title: string
  subtitle?: string
  wallpapers: Wallpaper[]
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-end justify-between px-5">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Ver tudo
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
        {wallpapers.map((w) => (
          <WallpaperCard
            key={w.id}
            wallpaper={w}
            className="w-36 shrink-0"
          />
        ))}
      </div>
    </section>
  )
}
