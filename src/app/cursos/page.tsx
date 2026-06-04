import { Suspense } from 'react'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { SkeletonCard } from '@/components/Skeleton'

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

async function CursosGrid() {
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
    <>
      <p className="text-gray-500 mb-8">{totalCursos} cursos disponibles · Actualizados al último examen oficial</p>
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
                <Card key={curso.id} className="hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className={`${colors[categoria.slug] ?? 'bg-gray-50'} h-28 flex items-center justify-center text-5xl rounded-t-lg`}>
                      {emojis[categoria.slug] ?? '📚'}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 leading-snug">{curso.title}</h3>
                      <p className="text-xs text-gray-400 mb-4 line-clamp-2">{curso.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-blue-600 font-bold text-lg">S/. {curso.price}</span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <PlayCircle className="h-3 w-3" />
                          {curso._count.lessons} clases
                        </span>
                      </div>
                      <Link href={`/cursos/${curso.id}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
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
    </>
  )
}

function CursosGridSkeleton() {
  return (
    <>
      <div className="h-4 bg-gray-100 rounded w-64 mb-8 animate-pulse" />
      <div className="mb-10">
        <div className="h-6 bg-gray-100 rounded w-48 mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </>
  )
}

export default function CursosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-4">
          <ArrowLeft className="h-3 w-3" /> Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold mb-2">Catálogo de cursos</h1>

        <Suspense fallback={<CursosGridSkeleton />}>
          <CursosGrid />
        </Suspense>

        <div className="mt-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">¿Quieres acceso a todo?</h2>
          <p className="text-blue-100 mb-6">Plan mensual por S/. 79 — todas las especialidades sin límites</p>
          <Link href="/register">
            <Button className="bg-white text-blue-700 hover:bg-blue-50" size="lg">
              Empezar ahora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}