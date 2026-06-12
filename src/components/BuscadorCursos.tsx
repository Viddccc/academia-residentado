'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, PlayCircle, X } from 'lucide-react'

interface Curso {
  id: string
  title: string
  description: string
  price: number
  category: { name: string; slug: string }
  _count: { lessons: number }
}

interface Props {
  cursos: Curso[]
}

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

const especialidades = [
  { slug: 'todos', label: 'Todos' },
  { slug: 'medicina-interna', label: 'Medicina Interna' },
  { slug: 'pediatria', label: 'Pediatría' },
  { slug: 'cirugia', label: 'Cirugía' },
  { slug: 'ginecologia', label: 'Ginecología' },
  { slug: 'psiquiatria', label: 'Psiquiatría' },
  { slug: 'salud-publica', label: 'Salud Pública' },
]

export default function BuscadorCursos({ cursos }: Props) {
  const [query, setQuery] = useState('')
  const [filtroEsp, setFiltroEsp] = useState('todos')
  const [filtroPrecio, setFiltroPrecio] = useState('todos')

  const resultados = useMemo(() => {
    return cursos.filter((c) => {
      const matchQuery = query === '' ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.category.name.toLowerCase().includes(query.toLowerCase())

      const matchEsp = filtroEsp === 'todos' || c.category.slug === filtroEsp

      const matchPrecio =
        filtroPrecio === 'todos' ? true :
        filtroPrecio === 'bajo' ? c.price <= 69 :
        filtroPrecio === 'medio' ? c.price > 69 && c.price <= 79 :
        c.price > 79

      return matchQuery && matchEsp && matchPrecio
    })
  }, [cursos, query, filtroEsp, filtroPrecio])

  const limpiar = () => {
    setQuery('')
    setFiltroEsp('todos')
    setFiltroPrecio('todos')
  }

  const hayFiltros = query !== '' || filtroEsp !== 'todos' || filtroPrecio !== 'todos'

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cursos, especialidades..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-gray-400 self-center mr-1">Especialidad:</span>
          {especialidades.map((e) => (
            <button
              key={e.slug}
              onClick={() => setFiltroEsp(e.slug)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filtroEsp === e.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {e.slug !== 'todos' && emojis[e.slug]} {e.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-400">Precio:</span>
            {[
              { value: 'todos', label: 'Todos' },
              { value: 'bajo', label: 'Hasta S/. 69' },
              { value: 'medio', label: 'S/. 70-79' },
              { value: 'alto', label: 'S/. 80+' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setFiltroPrecio(p.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filtroPrecio === p.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {hayFiltros && (
            <button
              onClick={limpiar}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {resultados.length === 0
            ? 'Sin resultados'
            : `${resultados.length} ${resultados.length === 1 ? 'curso encontrado' : 'cursos encontrados'}`}
        </p>
        {hayFiltros && (
          <Badge className="bg-blue-100 text-blue-700 text-xs">
            Filtros activos
          </Badge>
        )}
      </div>

      {resultados.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-500 mb-2">No encontramos cursos con esos filtros</p>
          <button onClick={limpiar} className="text-blue-600 text-sm hover:underline">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resultados.map((curso) => (
            <Card key={curso.id} className="hover:shadow-md transition-all hover:-translate-y-1">
              <CardContent className="p-