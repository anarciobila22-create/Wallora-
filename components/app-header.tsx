import { Bell } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="flex items-center justify-between px-5 pb-2 pt-6">
      <div>
        <p className="text-xs text-muted-foreground">Bem-vindo de volta</p>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          <span className="text-aura">WALLORA</span>
        </h1>
      </div>
      <button
        type="button"
        aria-label="Notificações"
        className="glass relative flex h-11 w-11 items-center justify-center rounded-full"
      >
        <Bell className="h-5 w-5" />
        <span
          className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[var(--aura-rose)]"
          style={{ boxShadow: '0 0 8px var(--aura-rose)' }}
        />
      </button>
    </header>
  )
}
