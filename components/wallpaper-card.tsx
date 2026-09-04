'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, Download } from 'lucide-react'
import type { Wallpaper } from '@/lib/wallpapers'
import { cn } from '@/lib/utils'

export function WallpaperCard({
  wallpaper,
  className,
  priority = false,
}: {
  wallpaper: Wallpaper
  className?: string
  priority?: boolean
}) {
  const [liked, setLiked] = useState(false)

  return (
    <div
      className={cn(
        'group relative aspect-[9/16] overflow-hidden rounded-3xl',
        'ring-1 ring-white/10 transition-transform duration-500 active:scale-[0.98]',
        className,
      )}
    >
      <Link
        href={`/wallpaper/${wallpaper.id}`}
        className="absolute inset-0 z-0"
        aria-label={`Abrir ${wallpaper.title}`}
      >
        <Image
          src={wallpaper.src || '/placeholder.svg'}
          alt={`Wallpaper ${wallpaper.title} por ${wallpaper.author}`}
          fill
          sizes="(max-width: 448px) 50vw, 224px"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="truncate font-display text-sm font-semibold text-white">
            {wallpaper.title}
          </h3>

          <div className="mt-1 flex items-center gap-3 text-[11px] text-white/70">
            <span className="truncate">{wallpaper.author}</span>

            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {wallpaper.downloads}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => setLiked((v) => !v)}
        aria-label={liked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        aria-pressed={liked}
        className="glass absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full"
      >
        <Heart
          className={cn(
            'h-4 w-4',
            liked
              ? 'fill-[var(--aura-rose)] text-[var(--aura-rose)]'
              : 'text-white',
          )}
        />
      </button>
    </div>
  )
}