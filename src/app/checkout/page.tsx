'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Lock, ArrowLeft } from 'lucide-react'

declare global {
  interface Window {
    Culqi: any
    culqi: any
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const cursoId = searchParams.get('cursoId')
  const plan = searchParams.get('plan')

  const [curso, setCurso] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  useEffect(() => {
    if (cursoId) {
      fetch(`/api/cursos/${cursoId}`)
        .then(r => r.json())
        .then(data => {
          setCurso(data)
          setLoading(false)
        })
    } else {
      setCurso({
        id: 'plan-mensual',
        title: 'Plan Mensual — Acceso completo',
        price: 79,
      })
      setLoading(false)
    }
  }, [cursoId])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.culqi.com/js/v4'
    script.async = true
    script.onload = () => {
      window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || 'pk_test_vzMuTHbEo6ZpHjnN'
      window.Culqi.settings({
        title: 'MedPrep Academy',
        currency: 'PEN',
        description: curso?.title || 'Curso MedPrep Academy',
        amount: (curso?.price || 79) * 100,
      })
      window.Culqi.options({
        lang: 'es',
        installments: false,
      })
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [curso])

  const handlePago = async () => {
    if (!window.Culqi) return
    window.Culqi.open()

    window.culqi = async () => {
      if (window.Culqi.token) {
        const token = window.Culqi.token.id
        setProcesando(true)
        setError('')

        try {
          const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token,
              cursoId: curso?.id,
              amount: (curso?.price || 79) * 100,
              email: window.Culqi.token.email,
            }),
          })

          const data = await res.json()

          if (res.ok) {
            setExito(true)
            setTimeout(() => router.push('/dashboard'), 3000)
          } else {
            setError(data.error || 'Error al procesar el pago')
          }
        } catch {
          setError('Error de conexión. Intenta nuevamente.')
        } finally {
          setProcesando(false)
        }
      } else if (window.Culqi.error) {
        setError(window.Culqi.error.user_message)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  if (exito) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
            <p className="text-gray-500 mb-4">Tu acceso ha sido activado. Redirigiendo al dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-blue-700 text-lg">🩺 MedPrep Academy</Link>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Lock className="h-4 w-4" /> Pago 100% seguro
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/cursos" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-6">
          <ArrowLeft className="h-3 w-3" /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resumen del pedido */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Resumen del pedido</h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="font-medium text-blue-900">{curso?.title}</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">S/. {curso?.price}</div>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-600 mb-6">
                {[
                  'Acceso inmediato tras el pago',
                  'Videos HD + material PDF',
                  'Preguntas tipo residentado',
                  'Garantía de devolución 24h',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Subtotal</span>
                  <span>S/. {curso?.price}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span className="text-blue-600">S/. {curso?.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón de pago */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">Método de pago</h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
                <p className="font-medium mb-2">💳 Aceptamos:</p>
                <p>Visa, Mastercard, American Express</p>
                <p className="mt-1 text-xs text-gray-400">Procesado de forma segura por Culqi</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <Button
                onClick={handlePago}
                disabled={procesando}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Lock className="mr-2 h-4 w-4" />
                {procesando ? 'Procesando...' : `Pagar S/. ${curso?.price}`}
              </Button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Al pagar aceptas nuestros términos y condiciones. Pago seguro con SSL.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>}>
      <CheckoutContent />
    </Suspense>
  )
}