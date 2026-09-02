'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'
import { login } from '@/app/actions/admin'

export function AdminLogin() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(login, null as
    | { error?: string; success?: boolean }
    | null)

  useEffect(() => {
    if (state?.success) router.refresh()
  }, [state, router])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6">
      <div className="glass-strong w-full max-w-sm rounded-3xl p-7">
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15"
          style={{ boxShadow: '0 0 32px -8px var(--aura-violet)' }}
        >
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-center font-display text-xl font-bold tracking-tight">
          Área do criador
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Introduz a tua palavra-passe para gerir wallpapers
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Palavra-passe"
            className="glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:aura-ring"
          />
          {state?.error && (
            <p className="text-xs text-red-400">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60 aura-ring"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
