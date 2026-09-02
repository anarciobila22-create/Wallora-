'use client'

import { useActionState, useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ImagePlus, Loader2, LogOut, Trash2, Check } from 'lucide-react'
import { categories } from '@/lib/wallpapers'
import {
  uploadWallpaper,
  deleteWallpaper,
  logout,
} from '@/app/actions/admin'
import { cn } from '@/lib/utils'

export type AdminWallpaper = {
  id: number
  title: string
  category: string
  blob_url: string
}

export function AdminDashboard({ items }: { items: AdminWallpaper[] }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [category, setCategory] = useState(categories[0].name)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, startDelete] = useTransition()

  const [state, formAction, pending] = useActionState(uploadWallpaper, null as
    | { error?: string; success?: boolean }
    | null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      setPreview(null)
      setCategory(categories[0].name)
      router.refresh()
    }
  }, [state, router])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
    else setPreview(null)
  }

  function handleDelete(item: AdminWallpaper) {
    setDeletingId(item.id)
    startDelete(async () => {
      await deleteWallpaper(item.id, item.blob_url)
      setDeletingId(null)
      router.refresh()
    })
  }

  return (
    <div className="px-5 pb-8">
      <header className="flex items-center justify-between pb-2 pt-6">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Painel do criador
          </h1>
          <p className="text-sm text-muted-foreground">
            Adiciona e gere os teus wallpapers
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            aria-label="Sair"
            className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </header>

      {/* Upload form */}
      <form
        ref={formRef}
        action={formAction}
        className="glass-strong mt-4 flex flex-col gap-4 rounded-3xl p-5"
      >
        <label className="relative flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-center">
          {preview ? (
            <Image
              src={preview || '/placeholder.svg'}
              alt="Pré-visualização"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">Toca para escolher uma imagem</span>
              <span className="text-xs opacity-70">PNG, JPG · até 15 MB</span>
            </div>
          )}
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            onChange={onFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>

        <input
          type="text"
          name="title"
          required
          placeholder="Título do wallpaper"
          className="glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:aura-ring"
        />

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Categoria
          </p>
          <input type="hidden" name="category" value={category} />
          <div className="no-scrollbar flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = category === c.name
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setCategory(c.name)}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
                    active
                      ? 'bg-primary text-primary-foreground aura-ring'
                      : 'glass text-muted-foreground',
                  )}
                >
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>

        {state?.error && <p className="text-xs text-red-400">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60 aura-ring"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> A publicar...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" /> Publicar wallpaper
            </>
          )}
        </button>
      </form>

      {/* Existing custom wallpapers */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Os teus wallpapers
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {items.length}
          </span>
        </h2>

        {items.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Ainda não adicionaste nenhum wallpaper.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.blob_url || '/placeholder.svg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="truncate text-xs font-semibold">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={isDeleting && deletingId === item.id}
                  aria-label={`Apagar ${item.title}`}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-red-500/80 disabled:opacity-60"
                >
                  {isDeleting && deletingId === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
