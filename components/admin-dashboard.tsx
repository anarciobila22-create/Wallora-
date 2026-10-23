
'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import { upload } from '@vercel/blob/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ImagePlus,
  Loader2,
  LogOut,
  Trash2,
  Check,
} from 'lucide-react'
import { categories } from '@/lib/wallpapers'
import {
  saveUploadedWallpaper,
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

export function AdminDashboard({
  items,
}: {
  items: AdminWallpaper[]
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [category, setCategory] = useState(categories[0].name)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, startDelete] = useTransition()

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function onFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0]

    setError(null)

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Seleciona um ficheiro de imagem válido.')
        e.target.value = ''
        setPreview(null)
        return
      }

      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (uploading) return

    setError(null)
    setProgress(0)

    const form = e.currentTarget
    const formData = new FormData(form)

    const title = String(formData.get('title') ?? '').trim()
    const selectedCategory = String(
      formData.get('category') ?? '',
    ).trim()
    const file = formData.get('file')

    if (!title) {
      setError('Dá um título ao wallpaper.')
      return
    }

    if (!categories.some((c) => c.name === selectedCategory)) {
      setError('Escolhe uma categoria válida.')
      return
    }

    if (!(file instanceof File) || file.size === 0) {
      setError('Seleciona uma imagem.')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('O ficheiro tem de ser uma imagem.')
      return
    }

    setUploading(true)

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/wallpaper-upload',
        clientPayload: JSON.stringify({
          title,
          category: selectedCategory,
        }),
        onUploadProgress: ({ percentage }) => {
          setProgress(Math.round(percentage))
        },
      })

      const result = await saveUploadedWallpaper(
        title,
        selectedCategory,
        blob.url,
      )

      if (!result.success) {
        setError(
          result.error ??
            'Não foi possível guardar o wallpaper.',
        )
        return
      }

      form.reset()
      setPreview(null)
      setCategory(categories[0].name)
      setProgress(100)

      router.refresh()
    } catch (err) {
      console.error('[WALLORA] Upload failed:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Falha ao publicar. Verifica a ligação e tenta novamente.',
      )
    } finally {
      setUploading(false)
    }
  }

  function handleDelete(item: AdminWallpaper) {
    setDeletingId(item.id)

    startDelete(async () => {
      try {
        await deleteWallpaper(item.id, item.blob_url)
        router.refresh()
      } catch (err) {
        console.error('[WALLORA] Delete failed:', err)
        setError('Não foi possível apagar este wallpaper.')
      } finally {
        setDeletingId(null)
      }
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

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="glass-strong mt-4 flex flex-col gap-4 rounded-3xl p-5"
      >
        <label className="relative flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.03] text-center">
          {preview ? (
            <Image
              src={preview}
              alt="Pré-visualização"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">
                Toca para escolher uma imagem
              </span>
              <span className="text-xs opacity-70">
                PNG, JPG, WebP, GIF ou AVIF
              </span>
            </div>
          )}

          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            required
            disabled={uploading}
            onChange={onFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>

        <input
          type="text"
          name="title"
          required
          disabled={uploading}
          placeholder="Título do wallpaper"
          className="glass rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:aura-ring"
        />

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Categoria
          </p>

          <input
            type="hidden"
            name="category"
            value={category}
          />

          <div className="no-scrollbar flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = category === c.name

              return (
                <button
                  key={c.name}
                  type="button"
                  disabled={uploading}
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

        {uploading && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>A enviar imagem...</span>
              <span>{progress}%</span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60 aura-ring"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              A publicar...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Publicar wallpaper
            </>
          )}
        </button>
      </form>

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
                  <p className="truncate text-xs font-semibold">
                    {item.title}
                  </p>
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
