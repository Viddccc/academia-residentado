import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, ClipboardCheck, BarChart2, ShoppingBag, LogOut } from 'lucide-react'
export const dynamic = 'force-dynamic'
import Navbar from '@/components/Navbar'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: {
      enrollments: { include: { course: true } },
      attempts: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0">
          <nav className="flex flex-col gap-1">
            {[
              { href: '/dashboard', icon: BarChart2, label: 'Dashboard', active: true },
              { href: '/dashboard/cursos', icon: BookOpen, label: 'Mis cursos', active: false },
              { href: '/dashboard/simulacro', icon: ClipboardCheck, label: 'Simulacros', active: false },
              { href: '/dashboard/compras', icon: ShoppingBag, label: 'Mis compras', active: false },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <h1 className="text-xl font-semibold mb-6">Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">Cursos activos</div>
                <div className="text-2xl font-bold">{user?.enrollments.length ?? 0}</div>
                <div className="text-xs text-gray-400">cursos comprados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">Simulacros hechos</div>
                <div className="text-2xl font-bold">{user?.attempts.length ?? 0}</div>
                <div className="text-xs text-gray-400">intentos totales</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-1">Último puntaje</div>
                <div className="text-2xl font-bold text-blue-600">
                  {user?.attempts[0] ? `${user.attempts[0].score}/180` : '—'}
                </div>
                <div className="text-xs text-gray-400">simulacro reciente</div>
              </CardContent>
            </Card>
          </div>

          {/* Cursos */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Mis cursos</h2>
                <Link href="/cursos">
                  <Button variant="outline" size="sm">Ver catálogo</Button>
                </Link>
              </div>
              {user?.enrollments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aún no tienes cursos.</p>
                  <Link href="/cursos">
                    <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
                      Explorar cursos
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {user?.enrollments.map((e) => (
                    <div key={e.id} className="flex items-center justify-between border rounded-lg p-3">
                      <span className="text-sm font-medium">{e.course.title}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${e.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{e.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Simulacro CTA */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg mb-1">¿Listo para un simulacro?</h2>
                <p className="text-blue-100 text-sm">180 preguntas · 3 horas · Retroalimentación inmediata</p>
              </div>
              <Link href="/dashboard/simulacro">
                <Button className="bg-white text-blue-700 hover:bg-blue-50">
                  Iniciar simulacro
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}