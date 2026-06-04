'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const getPasswordStrength = () => {
    const p = form.password
    if (p.length === 0) return null
    if (p.length < 6) return { label: 'Muy corta', color: 'bg-red-400', width: '25%' }
    if (p.length < 8) return { label: 'Débil', color: 'bg-orange-400', width: '50%' }
    if (p.length < 12) return { label: 'Buena', color: 'bg-yellow-400', width: '75%' }
    return { label: 'Fuerte', color: 'bg-green-500', width: '100%' }
  }

  const strength = getPasswordStrength()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Por favor ingresa un correo electrónico válido')
      return
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al registrarse')
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo — decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex-col justify-between p-12 text-white">
        <div className="text-2xl font-bold">🩺 MedPrep Academy</div>
        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Prepárate para el Residentado con los mejores recursos
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Banco de preguntas actualizado, simulacros reales y estadísticas personalizadas.
          </p>
          <div className="flex flex-col gap-3">
            {[
              '60+ preguntas de las últimas convocatorias',
              'Simulacros con timer y retroalimentación',
              'Estadísticas de rendimiento por especialidad',
              'Acceso desde cualquier dispositivo',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-blue-100">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-blue-300 text-sm">© 2025 MedPrep Academy</div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-blue-700">🩺 MedPrep Academy</Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Crea tu cuenta</h2>
            <p className="text-gray-500">Regístrate gratis y empieza a prepararte hoy</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nombre */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Dr. Juan Pérez"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} rounded-full transition-all`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Seguridad: <span className="font-medium">{strength.label}</span></p>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  name="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Repite tu contraseña"
                  value={form.confirm}
                  onChange={handleChange}
                  className={`w-full border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    form.confirm && form.password !== form.confirm
                      ? 'border-red-300 focus:ring-red-500'
                      : form.confirm && form.password === form.confirm
                      ? 'border-green-300 focus:ring-green-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {form.confirm && form.password === form.confirm && (
                  <CheckCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta gratis <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-2">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}