import Image from 'next/image'
import { Download, Sparkles } from 'lucide-react'
import type { Wallpaper } from '@/lib/wallpapers'

export function FeaturedHero({ wallpaper }: { wallpaper: Wallpaper }) {
  return (
    <section className="animate-fade-rise px-5">
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[2rem] ring-1 ring-white/10">
        <Image
          src={wallpaper.src || '/placeholder.svg'}
          alt={`Destaque: ${wallpaper.title}`}
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div className="glass absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[var(--aura-teal)]" />
          <span className="text-xs font-medium">Destaque do dia</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div className="min-w-0">
            <h2 className="truncate font-display text-2xl font-bold text-white">
              {wallpaper.title}
            </h2>
            <p className="text-sm text-white/70">por {wallpaper.author}</p>
          </div>
          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
            style={{ boxShadow: '0 0 32px -8px var(--aura-violet)' }}
          >
            <Download className="h-4 w-4" />
            Obter
          </button>
        </div>
      </div>
    </section>
  )
}
