import {
  Crown,
  Download,
  Heart,
  Palette,
  Settings,
  ChevronRight,
  Moon,
  CircleHelp,
} from 'lucide-react'

const stats = [
  { label: 'Downloads', value: '128', icon: Download },
  { label: 'Favoritos', value: '46', icon: Heart },
  { label: 'Coleções', value: '7', icon: Palette },
]

const menu = [
  { label: 'Definições da conta', icon: Settings },
  { label: 'Aparência', icon: Moon },
  { label: 'Ajuda e suporte', icon: CircleHelp },
]

export default function ProfilePage() {
  return (
    <div>
      <header className="px-5 pb-2 pt-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Perfil
        </h1>
      </header>

      {/* Profile card */}
      <div className="px-5 py-3">
        <div className="glass flex items-center gap-4 rounded-3xl p-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-bold text-primary-foreground"
            style={{
              background:
                'linear-gradient(135deg, var(--aura-teal), var(--aura-violet))',
            }}
          >
            A
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold">Alex Moreira</h2>
            <p className="truncate text-sm text-muted-foreground">
              alex.moreira@wallora.app
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-5 py-2">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="glass flex flex-col items-center gap-1 rounded-2xl py-4"
          >
            <Icon className="h-4 w-4 text-[var(--aura-teal)]" />
            <span className="font-display text-lg font-bold">{value}</span>
            <span className="text-[11px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Premium banner */}
      <div className="px-5 py-3">
        <div
          className="relative overflow-hidden rounded-3xl p-5 ring-1 ring-white/10"
          style={{
            background:
              'linear-gradient(120deg, oklch(0.3 0.14 300 / 0.6), oklch(0.3 0.1 195 / 0.5))',
          }}
        >
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-[var(--aura-rose)]" />
            <span className="font-display text-lg font-bold">
              WALLORA Premium
            </span>
          </div>
          <p className="mt-1 max-w-[80%] text-sm text-white/75">
            Wallpapers 4K exclusivos, sem anúncios e downloads ilimitados.
          </p>
          <button
            type="button"
            className="mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform active:scale-95"
          >
            Fazer upgrade
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 py-2">
        <div className="glass overflow-hidden rounded-3xl">
          {menu.map(({ label, icon: Icon }, i) => (
            <button
              key={label}
              type="button"
              className={`flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-white/5 ${
                i !== menu.length - 1 ? 'border-b border-white/8' : ''
              }`}
            >
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
