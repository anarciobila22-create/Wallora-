import { Heart } from 'lucide-react'
import { WallpaperCard } from '@/components/wallpaper-card'
import { wallpapers } from '@/lib/wallpapers'

export default function FavoritesPage() {
  const favorites = wallpapers.filter((w) =>
    ['space-aura', 'anime-aura', 'aura-waves', 'cars-aura', 'aura-orb', 'minimal-aura'].includes(
      w.id,
    ),
  )

  return (
    <div>
      <header className="px-5 pb-2 pt-6">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-[var(--aura-rose)] text-[var(--aura-rose)]" />
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Favoritos
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          A tua coleção pessoal de auras
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 px-5 py-4">
        {favorites.map((w, i) => (
          <WallpaperCard key={w.id} wallpaper={w} priority={i < 4} />
        ))}
      </div>
    </div>
  )
}
