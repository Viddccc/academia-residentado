import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  BookOpen, Users, Trophy, Clock, CheckCircle,
  Star, ArrowRight, PlayCircle
} from 'lucide-react'

const courses = [
  { title: 'Medicina Interna', lessons: 24, price: 79, emoji: '🫀', badge: 'Más popular', color: 'bg-blue-50' },
  { title: 'Pediatría', lessons: 18, price: 69, emoji: '👶', badge: 'Nuevo', color: 'bg-teal-50' },
  { title: 'Cirugía General', lessons: 30, price: 89, emoji: '🔬', badge: '', color: 'bg-purple-50' },
  { title: 'Ginecología', lessons: 20, price: 79, emoji: '🩺', badge: '', color: 'bg-pink-50' },
  { title: 'Psiquiatría', lessons: 16, price: 59, emoji: '🧠', badge: '', color: 'bg-amber-50' },
  { title: 'Salud Pública', lessons: 22, price: 69, emoji: '📊', badge: '', color: 'bg-green-50' },
]

const plans = [
  {
    name: 'Por curso',
    price: 'S/. 49',
    period: 'pago único',
    features: ['1 especialidad', 'Videos + PDF', '50 preguntas', 'Acceso 6 meses'],
    cta: 'Elegir curso',
    featured: false,
  },
  {
    name: 'Plan Mensual',
    price: 'S/. 79',
    period: 'por mes',
    features: ['Todas las especialidades', 'Simulacros ilimitados', '5,200+ preguntas', 'Estadísticas detalladas', 'Actualizaciones incluidas'],
    cta: 'Empezar ahora',
    featured: true,
  },
  {
    name: 'Plan Anual',
    price: 'S/. 499',
    period: 'por año — ahorra 37%',
    features: ['Todo del plan mensual', '2 mentorías incluidas', 'Acceso SERUMS', 'Comunidad privada', 'Certificado digital'],
    cta: 'Elegir anual',
    featured: false,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-8">
          <div className="flex items-center gap-2 font-semibold text-blue-700 text-lg">
            🩺 MedPrep Academy
          </div>
          <div className="hidden md:flex items-center gap-6 flex-1">
            <Link href="#cursos" className="text-sm text-gray-600 hover:text-gray-900">Cursos</Link>
            <Link href="#simulacros" className="text-sm text-gray-600 hover:text-gray-900">Simulacros</Link>
            <Link href="#planes" className="text-sm text-gray-600 hover:text-gray-900">Planes</Link>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Iniciar sesión</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Registrarse</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Badge className="bg-white/20 text-white border-white/30 mb-4">
            🏆 #1 en preparación para Residentado Médico
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight mb-4">
            Aprueba el Examen de Residentado Médico
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mb-8">
            Cursos actualizados, banco de 5,200+ preguntas y simulacros
            con condiciones idénticas al examen real del MINSA y EsSalud.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                Comenzar gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#simulacros">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <PlayCircle className="mr-2 h-4 w-4" /> Ver simulacro demo
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
            <div><div className="text-3xl font-bold">8,400+</div><div className="text-blue-200 text-sm">médicos preparados</div></div>
            <div><div className="text-3xl font-bold">94%</div><div className="text-blue-200 text-sm">tasa de aprobación</div></div>
            <div><div className="text-3xl font-bold">5,200+</div><div className="text-blue-200 text-sm">preguntas actualizadas</div></div>
            <div><div className="text-3xl font-bold">12</div><div className="text-blue-200 text-sm">especialidades</div></div>
          </div>
        </div>
      </section>

      {/* Cursos */}
      <section id="cursos" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Cursos por especialidad</h2>
            <p className="text-gray-500">Contenido actualizado al último examen oficial</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.title} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className={`${course.color} h-24 flex items-center justify-center text-4xl rounded-t-lg`}>
                    {course.emoji}
                  </div>
                  <div className="p-4">
                    {course.badge && (
                      <Badge className="bg-blue-100 text-blue-700 mb-2">{course.badge}</Badge>
                    )}
                    <h3 className="font-semibold mb-3">{course.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold text-lg">S/. {course.price}</span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" /> {course.lessons} clases
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Simulacros */}
      <section id="simulacros" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <Badge className="bg-blue-100 text-blue-700 mb-4">Simulacros reales</Badge>
            <h2 className="text-3xl font-bold mb-4">Practica como si fuera el día del examen</h2>
            <p className="text-gray-500 mb-6">180 preguntas, 3 horas cronometradas, retroalimentación inmediata y estadísticas de rendimiento por área.</p>
            <div className="flex flex-col gap-3">
              {['Preguntas de los últimos 5 exámenes oficiales', 'Retroalimentación con justificación por pregunta', 'Estadísticas de rendimiento por especialidad', 'Modo examen y modo práctica'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> {f}
                </div>
              ))}
            </div>
            <Link href="/register">
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                Hacer simulacro gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex-1 bg-white rounded-2xl border p-6 shadow-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Pregunta 3 de 180</span>
              <span className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="h-3 w-3" /> 2:18:44
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              Paciente de 58 años con HTA, presenta dolor torácico opresivo de 2 horas con supradesnivel ST en V1-V4. ¿Cuál es la conducta inmediata?
            </p>
            <div className="flex flex-col gap-2">
              {['Heparina IV + ecocardiograma', 'AAS + nitroglicerina + O₂ + morfina', 'Trombolisis inmediata con alteplase', 'Traslado a UCI sin intervención'].map((opt, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg border text-sm cursor-pointer ${i === 1 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium flex-shrink-0 ${i === 1 ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Elige tu plan</h2>
            <p className="text-gray-500">Sin contratos, cancela cuando quieras</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.featured ? 'border-2 border-blue-500 shadow-lg' : ''}`}>
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Más popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{plan.price}</div>
                  <div className="text-gray-400 text-sm mb-6">{plan.period}</div>
                  <div className="flex flex-col gap-2 mb-6">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/register">
                    <Button className={`w-full ${plan.featured ? 'bg-blue-600 hover:bg-blue-700' : 'variant-outline'}`} variant={plan.featured ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-semibold text-blue-700">🩺 MedPrep Academy</div>
          <div className="text-sm text-gray-400">© 2025 MedPrep Academy. Todos los derechos reservados.</div>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link href="#">Términos</Link>
            <Link href="#">Privacidad</Link>
            <Link href="#">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}