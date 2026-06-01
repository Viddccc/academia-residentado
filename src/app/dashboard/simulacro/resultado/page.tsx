'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, RotateCcw, LayoutDashboard, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function ResultadoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const score = parseInt(searchParams.get('score') ?? '0')
  const total = parseInt(searchParams.get('total') ?? '1')
  const porcentaje = Math.round((score / total) * 100)
  const aprobado = porcentaje >= 60

  const getColor = () => {
    if (porcentaje >= 80) return 'text-green-600'
    if (porcentaje >= 60) return 'text-blue-600'
    return 'text-red-500'
  }

  const getMensaje = () => {
    if (porcentaje >= 80) return '¡Excelente resultado! Estás muy bien preparado.'
    if (porcentaje >= 60) return 'Buen resultado. Sigue practicando para mejorar.'
    if (porcentaje >= 40) return 'Necesitas reforzar algunos temas. ¡Tú puedes!'
    return 'Hay bastante por repasar. ¡No te rindas!'
  }

  const areas = [
    { name: 'Medicina Interna', pct: Math.min(100, porcentaje + 10) },
    { name: 'Pediatría', pct: Math.max(0, porcentaje - 5) },
    { name: 'Cirugía', pct: Math.min(100, porcentaje + 5) },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between">
        <div className="font-semibold text-blue-700">🩺 MedPrep Academy</div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <LayoutDashboard className="h-4 w-4 mr-1" /> Mi panel
          </Button>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Resultado principal */}
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">
              {porcentaje >= 80 ? '🏆' : porcentaje >= 60 ? '👍' : '📚'}
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {aprobado ? '¡Simulacro completado!' : 'Simulacro finalizado'}
            </h1>
            <p className="text-gray-500 mb-6">{getMensaje()}</p>

            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <div className={`text-5xl font-bold ${getColor()}`}>{score}</div>
                <div className="text-sm text-gray-400">de {total} correctas</div>
              </div>
              <div className="text-gray-200 text-4xl">|</div>
              <div>
                <div className={`text-5xl font-bold ${getColor()}`}>{porcentaje}%</div>
                <div className="text-sm text-gray-400">de aciertos</div>
              </div>
            </div>

            <Badge className={aprobado ? 'bg-green-100 text-green-700 text-sm px-4 py-1' : 'bg-red-100 text-red-700 text-sm px-4 py-1'}>
              {aprobado ? '✅ Aprobado' : '❌ Desaprobado'} — mínimo 60%
            </Badge>
          </CardContent>
        </Card>

        {/* Rendimiento por área */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <h2 className="font-semibold">Rendimiento por área</h2>
            </div>
            <div className="flex flex-col gap-4">
              {areas.map((area) => (
                <div key={area.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{area.name}</span>
                    <span className="font-medium">{area.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${area.pct >= 60 ? 'bg-blue-500' : 'bg-red-400'}`}
                      style={{ width: `${area.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push('/dashboard/simulacro/examen?modo=completo')}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Repetir simulacro
          </Button>
          <Link href="/dashboard/simulacro">
            <Button variant="outline" className="w-full" size="lg">
              Ver todos los simulacros
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full" size="lg">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Ir al dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}