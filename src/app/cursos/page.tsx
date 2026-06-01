import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, BookOpen, ArrowLeft } from 'lucide-react'
export const dynamic = 'force-dynamic'

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

export default async function CursosPage() {
  const categorias = await db.category.findMany({
    include: {
      courses: {
        where: { published: true },
        include: { _count: { select: { lessons: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  const totalCursos = categorias.reduce((acc, cat) => acc + cat.courses.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 h-16 flex items-center gap-4">
        <Link href="/" className="font-semibold text-blue-700 text-lg">
          🩺 MedPrep Academy
        </Link>
        <div className="hidden md:flex items-center gap-6 flex-1 ml-4">
          <Link href="/cursos" className="text-sm font-medium text-gray-900">Cursos</Link>
          <Link href="#" className="text-sm text-gray-500">Simulacros</Link>
          <Link href="#" className="text-sm text-gray-500">Planes</Link>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Iniciar sesión</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Registrarse</Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-4">
            <ArrowLeft className="h-3 w-3" /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold mb-2">Catálogo de cursos</h1>
          <p className="text-gray-500">{totalCursos} cursos disponibles · Actualizados al último examen oficial</p>
        </div>

        {/* Categorías y cursos */}
        {categorias.map((categoria) => (
          categoria.courses.length > 0 && (
            <div key={categoria.id} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{emojis[categoria.slug] ?? '📚'}</span>
                <h2 className="text-xl font-semibold">{categoria.name}</h2>
                <Badge variant="secondary">{categoria.courses.length} cursos</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoria.courses.map((curso) => (
                  <Card key={curso.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className={`${colors[categoria.slug] ?? 'bg-gray-50'} h-28 flex items-center justify-center text-5xl rounded-t-lg`}>
                        {emojis[categoria.slug] ?? '📚'}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2 leading-snug">{curso.title}</h3>
                        <p className="text-xs text-gray-400 mb-4 line-clamp-2">{curso.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 font-bold text-lg">S/. {curso.price}</span>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <PlayCircle className="h-3 w-3" />
                            {curso._count.lessons} clases
                          </span>
                        </div>
                        <Link href={`/cursos/${curso.id}`}>
                          <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700" size="sm">
                            Ver curso
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        ))}

        {/* CTA inferior */}
        <div className="mt-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">¿Quieres acceso a todo?</h2>
          <p className="text-blue-100 mb-6">Plan mensual por S/. 79 — todas las especialidades sin límites</p>
          <Link href="/register">
            <Button className="bg-white text-blue-700 hover:bg-blue-50" size="lg">
              Empezar ahora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}