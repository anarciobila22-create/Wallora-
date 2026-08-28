export type Category =
  | 'AMOLED'
  | 'Natureza'
  | 'Carros'
  | 'Anime'
  | 'Abstrato'
  | 'Gaming'
  | 'Minimalista'
  | 'Espaço'
  | 'Aesthetic'

export const categories: { name: Category; glow: string }[] = [
  { name: 'AMOLED', glow: 'var(--aura-violet)' },
  { name: 'Natureza', glow: 'var(--aura-teal)' },
  { name: 'Carros', glow: 'var(--aura-rose)' },
  { name: 'Anime', glow: 'var(--aura-violet)' },
  { name: 'Abstrato', glow: 'var(--aura-teal)' },
  { name: 'Gaming', glow: 'var(--aura-rose)' },
  { name: 'Minimalista', glow: 'var(--aura-teal)' },
  { name: 'Espaço', glow: 'var(--aura-violet)' },
  { name: 'Aesthetic', glow: 'var(--aura-rose)' },
]

export type Wallpaper = {
  id: string
  title: string
  author: string
  category: Category
  src: string
  downloads: string
  likes: string
}

export const wallpapers: Wallpaper[] = [
  {
    id: 'amoled-aura',
    title: 'Obsidian Aura',
    author: 'Nova Lin',
    category: 'AMOLED',
    src: '/wallpapers/amoled-aura.png',
    downloads: '48.2k',
    likes: '12.1k',
  },
  {
    id: 'abstract-aura',
    title: 'Liquid Chrome',
    author: 'Iris Vale',
    category: 'Abstrato',
    src: '/wallpapers/abstract-aura.png',
    downloads: '39.7k',
    likes: '9.8k',
  },
  {
    id: 'space-aura',
    title: 'Nebula Drift',
    author: 'Orion K.',
    category: 'Espaço',
    src: '/wallpapers/space-aura.png',
    downloads: '61.4k',
    likes: '18.3k',
  },
  {
    id: 'anime-aura',
    title: 'Moonlit Solitude',
    author: 'Haru Sato',
    category: 'Anime',
    src: '/wallpapers/anime-aura.png',
    downloads: '55.0k',
    likes: '15.6k',
  },
  {
    id: 'nature-aura',
    title: 'Glow Forest',
    author: 'Elena Ross',
    category: 'Natureza',
    src: '/wallpapers/nature-aura.png',
    downloads: '33.1k',
    likes: '8.2k',
  },
  {
    id: 'cars-aura',
    title: 'Midnight Drive',
    author: 'Marco B.',
    category: 'Carros',
    src: '/wallpapers/cars-aura.png',
    downloads: '44.9k',
    likes: '11.4k',
  },
  {
    id: 'gaming-aura',
    title: 'Neon Vanguard',
    author: 'Kai Zhou',
    category: 'Gaming',
    src: '/wallpapers/gaming-aura.png',
    downloads: '52.6k',
    likes: '14.0k',
  },
  {
    id: 'minimal-aura',
    title: 'Single Line',
    author: 'Mira Ono',
    category: 'Minimalista',
    src: '/wallpapers/minimal-aura.png',
    downloads: '27.3k',
    likes: '6.9k',
  },
  {
    id: 'aesthetic-aura',
    title: 'Dream Sky',
    author: 'Lea Fontaine',
    category: 'Aesthetic',
    src: '/wallpapers/aesthetic-aura.png',
    downloads: '41.5k',
    likes: '10.7k',
  },
  {
    id: 'aura-orb',
    title: 'Pure Aura',
    author: 'Nova Lin',
    category: 'Abstrato',
    src: '/wallpapers/aura-orb.png',
    downloads: '37.8k',
    likes: '9.1k',
  },
  {
    id: 'aura-mountains',
    title: 'Aurora Peaks',
    author: 'Elena Ross',
    category: 'Natureza',
    src: '/wallpapers/aura-mountains.png',
    downloads: '46.2k',
    likes: '12.9k',
  },
  {
    id: 'aura-waves',
    title: 'Silk Motion',
    author: 'Iris Vale',
    category: 'Abstrato',
    src: '/wallpapers/aura-waves.png',
    downloads: '35.4k',
    likes: '8.7k',
  },
]

export const trending = wallpapers.filter((w) =>
  ['space-aura', 'anime-aura', 'gaming-aura', 'cars-aura'].includes(w.id),
)

export const newWallpapers = wallpapers.filter((w) =>
  ['aura-waves', 'aura-mountains', 'aura-orb', 'aesthetic-aura'].includes(w.id),
)

export const popular = wallpapers.filter((w) =>
  ['amoled-aura', 'abstract-aura', 'nature-aura', 'minimal-aura'].includes(
    w.id,
  ),
)
