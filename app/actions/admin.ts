
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { put, del } from '@vercel/blob'
import { createHmac, timingSafeEqual } from 'crypto'
import { sql } from '@/lib/db'
import { categories } from '@/lib/wallpapers'

const COOKIE_NAME = 'wallora_admin'

function expectedToken() {
  const secret = process.env.ADMIN_PASSWORD ?? ''
  return createHmac('sha256', secret)
    .update('wallora-admin-session')
    .digest('hex')
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)

  if (bufA.length !== bufB.length) return false

  return timingSafeEqual(bufA, bufB)
}

export async function isAdmin() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value

  if (!token) return false

  return safeEqual(token, expectedToken())
}

export async function login(_prev: unknown, formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const real = process.env.ADMIN_PASSWORD ?? ''

  if (!real) {
    return {
      error: 'ADMIN_PASSWORD não está configurada no servidor.',
    }
  }

  if (!password || !safeEqual(password, real)) {
    return { error: 'Palavra-passe incorreta.' }
  }

  const store = await cookies()

  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return { success: true }
}

export async function logout() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
  revalidatePath('/admin')
}

export async function uploadWallpaper(
  _prev: unknown,
  formData: FormData,
) {
  if (!(await isAdmin())) {
    return { error: 'Não autorizado.' }
  }

  const title = String(formData.get('title') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim()
  const file = formData.get('file') as File | null

  if (!title) return { error: 'Dá um título ao wallpaper.' }

  if (!categories.some((c) => c.name === category)) {
    return { error: 'Escolhe uma categoria válida.' }
  }

  if (!file || file.size === 0) {
    return { error: 'Seleciona uma imagem.' }
  }

  if (!file.type.startsWith('image/')) {
    return { error: 'O ficheiro tem de ser uma imagem.' }
  }

  try {
    const ext = file.name.split('.').pop() || 'jpg'
    const key = `wallpapers/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`

    const blob = await put(key, file, {
      access: 'public',
      contentType: file.type,
    })

    await sql`
      INSERT INTO custom_wallpapers (title, category, blob_url)
      VALUES (${title}, ${category}, ${blob.url})
    `

    revalidatePath('/')
    revalidatePath('/search')
    revalidatePath('/favorites')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('[WALLORA] Upload failed:', error)

    return {
      error: 'Falha ao carregar o wallpaper. Tenta novamente.',
    }
  }
}

export async function saveUploadedWallpaper(
  title: string,
  category: string,
  blobUrl: string,
) {
  if (!(await isAdmin())) {
    return { error: 'Não autorizado.' }
  }

  const cleanTitle = String(title ?? '').trim()
  const cleanCategory = String(category ?? '').trim()

  if (!cleanTitle) {
    return { error: 'Dá um título ao wallpaper.' }
  }

  if (!categories.some((c) => c.name === cleanCategory)) {
    return { error: 'Escolhe uma categoria válida.' }
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(blobUrl)
  } catch {
    return { error: 'O endereço da imagem é inválido.' }
  }

  if (
    parsedUrl.protocol !== 'https:' ||
    !parsedUrl.hostname.endsWith('.blob.vercel-storage.com')
  ) {
    return { error: 'O endereço da imagem não é válido.' }
  }

  try {
    await sql`
      INSERT INTO custom_wallpapers (title, category, blob_url)
      VALUES (${cleanTitle}, ${cleanCategory}, ${parsedUrl.toString()})
    `

    revalidatePath('/')
    revalidatePath('/search')
    revalidatePath('/favorites')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('[WALLORA] Database save failed:', error)

    return {
      error: 'A imagem foi enviada, mas não foi possível guardá-la na galeria.',
    }
  }
}

export async function deleteWallpaper(
  id: number,
  blobUrl: string,
) {
  if (!(await isAdmin())) {
    throw new Error('Não autorizado.')
  }

  try {
    await del(blobUrl)
  } catch (error) {
    console.error('[WALLORA] Blob delete failed:', error)
  }

  await sql`
    DELETE FROM custom_wallpapers
    WHERE id = ${id}
  `

  revalidatePath('/')
  revalidatePath('/search')
  revalidatePath('/favorites')
  revalidatePath('/admin')
}
