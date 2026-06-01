import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, FileQuestion, BarChart2, ArrowLeft, PlayCircle } from 'lucide-react'

export default async function SimulacroPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: {
      attempts: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  const totalPreguntas = await db.question.count()
  const especialidades = await db.specialty.findMany({
    include: { _count: { select: { questions: true } } },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-blue-700 text-lg">🩺 MedPrep Academy</Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Mi panel
          </Button>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Simulacros</h1>
        <p className="text-gray-500 mb-8">Practica con condiciones idénticas al examen real</p>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{totalPreguntas}</div>
              <div className="text-xs text-gray-400 mt-1">preguntas disponibles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{user?.attempts.length ?? 0}</div>
              <div className="text-xs text-gray-400 mt-1">simulacros realizados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {user?.attempts.length
                  ? Math.round(user.attempts.reduce((a, b) => a + b.score, 0) / user.attempts.length)
                  : '—'}
              </div>
              <div className="text-xs text-gray-400 mt-1">puntaje promedio</div>
            </CardContent>
          </Card>
        </div>

        {/* Modalidades */}
        <h2 className="font-semibold text-lg mb-4">Elegir modalidad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Examen completo */}
          <Card className="border-2 border-blue-200 hover:border-blue-500 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileQuestion className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Examen completo</div>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">Recomendado</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {totalPreguntas} preguntas de todas las especialidades. Condiciones idénticas al examen real.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 3 horas</span>
                <span className="flex items-center gap-1"><FileQuestion className="h-3 w-3" /> {totalPreguntas} preguntas</span>
              </div>
              <Link href="/dashboard/simulacro/examen?modo=completo">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <PlayCircle className="mr-2 h-4 w-4" /> Iniciar examen
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Por especialidad */}
          <Card className="hover:border-gray-400 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">Por especialidad</div>
                  <Badge className="bg-green-100 text-green-700 text-xs">Práctica dirigida</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Practica por área temática para reforzar tus puntos débiles.
              </p>
              <div className="flex flex-col gap-2">
                {especialidades.map((esp) => (
                  <Link key={esp.id} href={`/dashboard/simulacro/examen?modo=especialidad&especialidadId=${esp.id}`}>
                    <Button variant="outline" className="w-full justify-between" size="sm">
                      <span>{esp.name}</span>
                      <span className="text-gray-400 text-xs">{esp._count.questions} preguntas</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historial */}
        {user?.attempts && user.attempts.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-4">Historial de simulacros</h2>
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Fecha</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Puntaje</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.attempts.map((attempt) => (
                      <tr key={attempt.id} className="border-b last:border-0">
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(attempt.createdAt).toLocaleDateString('es-PE')}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {attempt.score}/{totalPreguntas}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={attempt.score / totalPreguntas >= 0.6
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          }>
                            {attempt.score / totalPreguntas >= 0.6 ? 'Aprobado' : 'Desaprobado'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}