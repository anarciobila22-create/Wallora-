import {
  handleUpload,
  type HandleUploadBody,
} from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/actions/admin'
import { categories } from '@/lib/wallpapers'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Não autorizado.' },
        { status: 401 },
      )
    }

    const body = (await request.json()) as HandleUploadBody

    const result = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!(await isAdmin())) {
          throw new Error('Não autorizado.')
        }

        let data: { title?: string; category?: string }

        try {
          data = JSON.parse(clientPayload || '{}')
        } catch {
          throw new Error('Dados do wallpaper inválidos.')
        }

        const title = String(data.title ?? '').trim()
        const category = String(data.category ?? '').trim()

        if (!title) {
          throw new Error('Dá um título ao wallpaper.')
        }

        if (!categories.some((item) => item.name === category)) {
          throw new Error('Escolhe uma categoria válida.')
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/avif',
          ],
          addRandomSuffix: true,
        }
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Falha ao preparar o envio da imagem.'

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
