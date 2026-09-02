import 'server-only'
import { sql } from '@/lib/db'
import type { Category, Wallpaper } from '@/lib/wallpapers'
import {
  wallpapers as staticWallpapers,
  trending as staticTrending,
  newWallpapers as staticNew,
  popular as staticPopular,
} from '@/lib/wallpapers'

export type CustomWallpaperRow = {
  id: number
  title: string
  category: string
  blob_url: string
  width: number | null
  height: number | null
  created_at: string
}

function rowToWallpaper(row: CustomWallpaperRow): Wallpaper {
  return {
    id: `custom-${row.id}`,
    title: row.title,
    author: 'Criador',
    category: row.category as Category,
    src: row.blob_url,
    downloads: 'Novo',
    likes: 'Novo',
  }
}

export async function getCustomWallpapers(): Promise<Wallpaper[]> {
  try {
    const rows = (await sql`
      SELECT id, title, category, blob_url, width, height, created_at
      FROM custom_wallpapers
      ORDER BY created_at DESC
    `) as CustomWallpaperRow[]
    return rows.map(rowToWallpaper)
  } catch (error) {
    console.log('[v0] Failed to load custom wallpapers:', error)
    return []
  }
}

/** All wallpapers: custom (newest first) followed by the built-in collection. */
export async function getAllWallpapers(): Promise<Wallpaper[]> {
  const custom = await getCustomWallpapers()
  return [...custom, ...staticWallpapers]
}

/** Home page sections with custom wallpapers woven in. */
export async function getHomeSections() {
  const custom = await getCustomWallpapers()
  return {
    custom,
    trending: staticTrending,
    newWallpapers: [...custom, ...staticNew],
    popular: staticPopular,
  }
}
