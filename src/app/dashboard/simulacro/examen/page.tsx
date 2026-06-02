'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react'

interface Pregunta {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
  specialty: { name: string }
}

function ExamenContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const modo = searchParams.get('modo')
  const especialidadId = searchParams.get('especialidadId')

  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [current, setCurrent] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutos en segundos
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)

  // Cargar preguntas
  useEffect(() => {
    const url = especialidadId
      ? `/api/preguntas?especialidadId=${especialidadId}`
      : '/api/preguntas'

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setPreguntas(data)
        setLoading(false)
      })
  }, [especialidadId])

  // Timer
  useEffect(() => {
    if (loading) return
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          handleSubmit()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [loading])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleRespuesta = (opcionIndex: number) => {
    setRespuestas((prev) => ({ ...prev, [current]: opcionIndex }))
  }

  const handleSubmit = useCallback(async () => {
    if (enviando) return
    setEnviando(true)

    const answers = preguntas.map((p, i) => ({
      questionId: p.id,
      selected: respuestas[i] ?? -1,
      correct: p.correctAnswer,
    }))

    const score = answers.filter((a) => a.selected === a.correct).length

    try {
      const res = await fetch('/api/simulacro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, answers }),
      })
      const data = await res.json()
      router.push(`/dashboard/simulacro/resultado?attemptId=${data.attemptId}&score=${score}&total=${preguntas.length}`)
    } catch {
      router.push(`/dashboard/simulacro/resultado?score=${score}&total=${preguntas.length}`)
    }
  }, [enviando, preguntas, respuestas, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Cargando preguntas...</p>
        </div>
      </div>
    )
  }

  if (preguntas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500 mb-4">No hay preguntas disponibles aún.</p>
          <Button onClick={() => router.push('/dashboard/simulacro')}>Volver</Button>
        </div>
      </div>
    )
  }

  const pregunta = preguntas[current]
  const respondidas = Object.keys(respuestas).length
  const isUltima = current === preguntas.length - 1

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="font-semibold text-blue-700">🩺 MedPrep Academy</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{respondidas}/{preguntas.length} respondidas</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${timeLeft < 600 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 py-6 gap-6">
        {/* Panel de navegación */}
        <div className="w-48 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-xl border p-4 sticky top-24">
            <div className="text-xs font-medium text-gray-500 mb-3">Navegación</div>
            <div className="grid grid-cols-5 gap-1.5">
              {preguntas.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-7 w-7 rounded text-xs font-medium transition-colors ${
                    i === current
                      ? 'bg-blue-600 text-white'
                      : respuestas[i] !== undefined
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-1.5 text-xs text-gray-400">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded"></div>Actual</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-100 rounded"></div>Respondida</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-100 rounded border"></div>Sin responder</div>
            </div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-blue-100 text-blue-700">
                {pregunta.specialty?.name ?? 'General'}
              </Badge>
              <span className="text-sm text-gray-400">Pregunta {current + 1} de {preguntas.length}</span>
            </div>

            <p className="text-gray-800 leading-relaxed mb-6 text-sm md:text-base">
              {pregunta.text}
            </p>

            <div className="flex flex-col gap-3">
              {pregunta.options.map((opcion, i) => (
                <button
                  key={i}
                  onClick={() => handleRespuesta(i)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all ${
                    respuestas[current] === i
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    respuestas[current] === i
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opcion}
                </button>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>

            {isUltima ? (
              <Button
                onClick={handleSubmit}
                disabled={enviando}
                className="bg-green-600 hover:bg-green-700"
              >
                <Flag className="h-4 w-4 mr-2" />
                {enviando ? 'Enviando...' : 'Finalizar examen'}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrent((c) => Math.min(preguntas.length - 1, c + 1))}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Siguiente <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default function ExamenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Cargando examen...</p></div>}>
      <ExamenContent />
    </Suspense>
  )
}