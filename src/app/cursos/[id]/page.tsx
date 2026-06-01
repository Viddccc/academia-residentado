import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, PlayCircle, Clock, BookOpen, ArrowLeft, ShoppingCart } from 'lucide-react'

const emojis: Record<string, string> = {
  'medicina-interna': '🫀',
  'pediatria': '👶',
  'cirugia': '🔬',
  'ginecologia': '🩺',
  'psiquiatria': '🧠',
  'salud-publica': '📊',
}

const colors: Record<string, string> = {
  'medicina-interna': 'bg-blue-50',
  'pediatria': 'bg-teal-50',
  'cirugia': 'bg-purple-50',
  'ginecologia': 'bg-pink-50',
  'psiquiatria': 'bg-amber-50',
  'salud-publica': 'bg-green-50',
}

export default async function CursoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  const curso = await db.course.findUnique({
    where: { id },
    include: {
      category: true,
      lessons: { orderBy: { order: 'asc' } },
      _count: { select: { enrollments: true } },
    },
  })

  if (!curso) notFound()

  // Verificar si el usuario ya está inscrito
  let enrolled = false
  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })
    if (user) {
      const enrollment = await db.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId: curso.id } },
      })
      enrolled = !!enrollment
    }
  }

  const slug = curso.category.slug
  const emoji = emojis[slug] ?? '📚'
  const color = colors[slug] ?? 'bg-gray-50'

  const temario = [
    'Conceptos fundamentales y fisiopatología',
    'Diagnóstico clínico y criterios diagnósticos',
    'Exámenes auxiliares e interpretación',
    'Tratamiento farmacológico y no farmacológico',
    'Complicaciones y manejo de emergencias',
    'Preguntas tipo residentado con resolución',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 h-16 flex items-center gap-4">
        <Link href="/" className="font-semibold text-blue-700 text-lg">
          🩺 MedPrep Academy
        </Link>
        <div className="ml-auto flex items-center gap-3">
          {session ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Mi panel</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Iniciar sesión</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/cursos" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-6">
          <ArrowLeft className="h-3 w-3" /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {/* Hero del curso */}
            <div className={`${color} rounded-2xl p-10 flex items-center justify-center text-7xl mb-6`}>
              {emoji}
            </div>

            <Badge className="bg-blue-100 text-blue-700 mb-3">{curso.category.name}</Badge>
            <h1 className="text-3xl font-bold mb-3">{curso.title}</h1>
            <p className="text-gray-500 mb-6 leading-relaxed">{curso.description}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <PlayCircle className="h-4 w-4 text-blue-500" />
                {curso.lessons.length} clases en video
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-500" />
                Acceso de por vida
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-blue-500" />
                Material descargable incluido
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {curso._count.enrollments} estudiantes inscritos
              </div>
            </div>

            {/* Temario */}
            <div className="bg-white rounded-2xl border p-6 mb-6">
              <h2 className="font-semibold text-lg mb-4">Contenido del curso</h2>
              <div className="flex flex-col gap-3">
                {temario.map((tema, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-gray-700">{tema}</span>
                    {i === 0 && (
                      <Badge className="ml-auto bg-green-100 text-green-700 text-xs">Gratis</Badge>
                    )}
                  </div>
                ))}
                {curso.lessons.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Las lecciones se publicarán próximamente.
                  </p>
                )}
              </div>
            </div>

            {/* Lo que aprenderás */}
            <div className="bg-white rounded-2xl border p-6">
              <h2 className="font-semibold text-lg mb-4">Lo que aprenderás</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Reconocer los diagnósticos más frecuentes en el examen',
                  'Aplicar algoritmos de diagnóstico y tratamiento',
                  'Resolver preguntas tipo residentado con seguridad',
                  'Identificar los criterios diagnósticos clave',
                  'Manejar las emergencias más evaluadas',
                  'Optimizar tu tiempo de respuesta en el examen',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar de compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <div className="text-4xl font-bold text-blue-600 mb-1">S/. {curso.price}</div>
              <div className="text-sm text-gray-400 mb-6">Pago único · Acceso de por vida</div>

              {enrolled ? (
                <div className="flex flex-col gap-3">
                  <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg text-center font-medium">
                    ✅ Ya tienes acceso a este curso
                  </div>
                  <Link href="/dashboard">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Ir a mi panel
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href={session ? `/checkout?cursoId=${curso.id}` : `/register?redirect=/cursos/${curso.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Comprar curso
                    </Button>
                  </Link>
                  <Link href={`/checkout?plan=mensual`}>
                    <Button variant="outline" className="w-full" size="lg">
                      Ver plan mensual — S/. 79
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-400 text-center">
                    Acceso inmediato tras el pago · Garantía 24h
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t flex flex-col gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Videos HD descargables</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Material en PDF</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Preguntas tipo residentado</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Actualizado 2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}