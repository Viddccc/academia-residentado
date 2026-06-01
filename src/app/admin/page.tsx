import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, BookOpen, ShoppingBag, ClipboardCheck, LogOut } from 'lucide-react'

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user) redirect('/login')

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
  })

  if (user?.role !== 'ADMIN') redirect('/dashboard')

  const [totalUsuarios, totalCursos, totalOrdenes, totalSimulacros] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.order.count(),
    db.quizAttempt.count(),
  ])

  const ultimosUsuarios = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const ultimasOrdenes = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { user: true, items: { include: { course: true } } },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between">
        <div className="font-semibold text-blue-700 text-lg">🩺 MedPrep Academy — Admin</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user.name}</span>
          <Link href="/api/auth/signout">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <LogOut className="h-4 w-4 mr-1" /> Salir
            </Button>
          </Link>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 min-h-screen border-r bg-white flex-shrink-0 p-4">
          <nav className="flex flex-col gap-1">
            {[
              { href: '/admin', icon: ShoppingBag, label: 'Dashboard', active: true },
              { href: '/admin/cursos', icon: BookOpen, label: 'Cursos', active: false },
              { href: '/admin/usuarios', icon: Users, label: 'Usuarios', active: false },
              { href: '/admin/simulacros', icon: ClipboardCheck, label: 'Simulacros', active: false },
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
            <div className="mt-4 pt-4 border-t">
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                ← Panel estudiante
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Usuarios registrados', value: totalUsuarios, icon: Users, color: 'bg-blue-50 text-blue-600' },
              { label: 'Cursos publicados', value: totalCursos, icon: BookOpen, color: 'bg-teal-50 text-teal-600' },
              { label: 'Órdenes totales', value: totalOrdenes, icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
              { label: 'Simulacros hechos', value: totalSimulacros, icon: ClipboardCheck, color: 'bg-amber-50 text-amber-600' },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Últimos usuarios */}
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                  <h2 className="font-semibold">Últimos usuarios</h2>
                  <Link href="/admin/usuarios">
                    <Button variant="ghost" size="sm" className="text-blue-600 text-xs">Ver todos</Button>
                  </Link>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left px-5 py-2 text-gray-500 font-medium">Nombre</th>
                      <th className="text-left px-5 py-2 text-gray-500 font-medium">Rol</th>
                      <th className="text-left px-5 py-2 text-gray-500 font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimosUsuarios.map((u) => (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-5 py-2">
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </td>
                        <td className="px-5 py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-2 text-gray-400 text-xs">
                          {new Date(u.createdAt).toLocaleDateString('es-PE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Últimas órdenes */}
            <Card>
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-5 py-4 border-b">
                  <h2 className="font-semibold">Últimas órdenes</h2>
                </div>
                {ultimasOrdenes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No hay órdenes aún
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left px-5 py-2 text-gray-500 font-medium">Usuario</th>
                        <th className="text-left px-5 py-2 text-gray-500 font-medium">Total</th>
                        <th className="text-left px-5 py-2 text-gray-500 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimasOrdenes.map((o) => (
                        <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-5 py-2">
                            <div className="font-medium">{o.user.name}</div>
                          </td>
                          <td className="px-5 py-2 font-medium text-blue-600">
                            S/. {o.total}
                          </td>
                          <td className="px-5 py-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              o.status === 'PAID' ? 'bg-green-100 text-green-700' :
                              o.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}