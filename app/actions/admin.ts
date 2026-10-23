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
  return createHmac('sha256', secret).update('wallora-admin-session').digest('hex')
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
    return { error: 'ADMIN_PASSWORD não está configurada no servidor.' }
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

export async function uploadWallpaper(_prev: unknown, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: 'Não autorizado.' }
  }

  const title = String(formData.get('title') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim()
  const file = formData.get('file') as File | null

  if (!title) return { error: 'Dá um título ao wallpaper.' }
  const validCategory = categories.some((c) => c.name === category)
  if (!validCategory) return { error: 'Escolhe uma categoria válida.' }
  if (!file || file.size === 0) return { error: 'Seleciona uma imagem.' }
  if (!file.type.startsWith('image/')) return { error: 'O ficheiro tem de ser uma imagem.' }
  // Sem limite de tamanho definido pela aplicação.

  try {
    const ext = file.name.split('.').pop() || 'jpg'
    const key = `wallpapers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const blob = await put(key, file, { access: 'public', contentType: file.type })

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
    console.log('[v0] Upload failed:', error)
    return { error: 'Falha ao carregar o wallpaper. Tenta novamente.' }
  }
}

export async function deleteWallpaper(id: number, blobUrl: string) {
  if (!(await isAdmin())) {
    throw new Error('Não autorizado.')
  }
  try {
    await del(blobUrl)
  } catch (error) {
    console.log('[v0] Blob delete failed (continuing):', error)
  }
  await sql`DELETE FROM custom_wallpapers WHERE id = ${id}`
  revalidatePath('/')
  revalidatePath('/search')
  revalidatePath('/favorites')
  revalidatePath('/admin')
}
