'use client'

import { Suspense, useEffect, useState, useCallback, useRef } from 'react'
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
  const especialidadId = searchParams.get('especialidadId')

  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [current, setCurrent] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const enviandoRef = useRef(false)
  const preguntasRef = useRef<Pregunta[]>([])
  const respuestasRef = useRef<Record<number, number>>({})

  useEffect(() => {
    preguntasRef.current = preguntas
  }, [preguntas])

  useEffect(() => {
    respuestasRef.current = respuestas
  }, [respuestas])

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

  const submitExamen = useCallback(async () => {
    if (enviandoRef.current) return
    enviandoRef.current = true
    setEnviando(true)

    const currentPreguntas = preguntasRef.current
    const currentRespuestas = respuestasRef.current

    const answers = currentPreguntas.map((p, i) => ({
      questionId: p.id,
      selected: currentRespuestas[i] ?? -1,
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
      router.push(`/dashboard/simulacro/resultado?attemptId=${data.attemptId}&score=${score}&total=${currentPreguntas.length}`)
    } catch {
      router.push(`/dashboard/simulacro/resultado?score=${score}&total=${currentPreguntas.length}`)
    }
  }, [router])

  useEffect(() => {
    if (loading) return
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval)
          submitExamen()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [loading, submitExamen])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleRespuesta = (opcionIndex: number) => {
    setRespuestas((prev) => ({ ...prev, [current]: opcionIndex }))
  }

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
      {/* Header examen */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="font-semibold text-blue-700">🩺 MedPrep Academy</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{respondidas}/{preguntas.length} respondidas</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 py-6 gap-6">
        {/* Panel navegación */}
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
              <div className="flex items-center gap-2"><div c