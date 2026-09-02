import { AdminLogin } from '@/components/admin-login'
import { AdminDashboard, type AdminWallpaper } from '@/components/admin-dashboard'
import { isAdmin } from '@/app/actions/admin'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const authed = await isAdmin()

  if (!authed) {
    return <AdminLogin />
  }

  const items = (await sql`
    SELECT id, title, category, blob_url
    FROM custom_wallpapers
    ORDER BY created_at DESC
  `) as AdminWallpaper[]

  return <AdminDashboard items={items} />
}
