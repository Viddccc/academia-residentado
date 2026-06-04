'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Menu, X, BookOpen, ClipboardCheck, LayoutDashboard, LogOut, User, ShieldCheck } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/dashboard/simulacro', label: 'Simulacros', icon: ClipboardCheck },
    { href: '/#planes', label: 'Planes', icon: null },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg flex-shrink-0">
          🩺 <span className="hidden sm:inline">MedPrep Academy</span>
          <span className="sm:hidden">MedPrep</span>
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1 flex-1 ml-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(link.href)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Acciones desktop */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {session ? (
            <div className="flex items-center gap-2">
              {(session.user as any)?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Mi panel
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Menú"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 mt-2 pt-2">
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{session.user?.name}</div>
                      <div className="text-xs text-gray-400">{session.user?.email}</div>
                    </div>
                  </div>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-purple-600 hover:bg-purple-50"
                    >
                      <ShieldCheck className="h-4 w-4" /> Panel Admin
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Mi panel
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" /> Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 mx-3 mt-1 py-2.5 rounded-xl text-sm bg-blue-600 text-white font-medium"
                  >
                    Registrarse gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}