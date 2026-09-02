import { SearchView } from '@/components/search-view'
import { getAllWallpapers } from '@/lib/wallpaper-service'

export const dynamic = 'force-dynamic'

export default async function SearchPage() {
  const wallpapers = await getAllWallpapers()
  return <SearchView wallpapers={wallpapers} />
}
