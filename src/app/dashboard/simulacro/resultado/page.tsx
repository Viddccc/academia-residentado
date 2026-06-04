'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, LayoutDashboard, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

function ResultadoContent() {
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
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">
              {porcentaje >= 80 ? '🏆' : porcentaje >= 60 ? '👍' : '📚'}
            </div>
            <h1 className="text-2xl font-bold mb-2