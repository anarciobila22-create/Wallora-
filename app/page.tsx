import Link from 'next/link'
import { Search } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { CategoryPills } from '@/components/category-pills'
import { FeaturedHero } from '@/components/featured-hero'
import { SectionRail } from '@/components/section-rail'
import { wallpapers, trending, popular } from '@/lib/wallpapers'
import { getCustomWallpapers } from '@/lib/wallpaper-service'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const custom = await getCustomWallpapers()
  const newWallpapers = [
    ...custom,
    ...wallpapers.filter((w) =>
      ['aura-waves', 'aura-mountains', 'aura-orb', 'aesthetic-aura'].includes(
        w.id,
      ),
    ),
  ]
  const featured = wallpapers.find((w) => w.id === 'space-aura') ?? wallpapers[0]

  return (
    <div>
      <AppHeader />

      {/* Search shortcut */}
      <div className="px-5 py-3">
        <Link
          href="/search"
          className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5 text-muted-foreground"
        >
          <Search className="h-5 w-5" />
          <span className="text-sm">Procurar wallpapers, cores, criadores...</span>
        </Link>
      </div>

      <CategoryPills />

      <div className="mt-4">
        <FeaturedHero wallpaper={featured} />
      </div>

      <SectionRail
        title="Em tendência"
        subtitle="O que toda a gente adora agora"
        wallpapers={trending}
      />
      <SectionRail
        title="Novidades"
        subtitle="Acabados de chegar à coleção"
        wallpapers={newWallpapers}
      />
      <SectionRail
        title="Mais populares"
        subtitle="Downloads de topo de sempre"
        wallpapers={popular}
      />
    </div>
  )
}
