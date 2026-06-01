import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MedPrep Academy — Preparación para Residentado Médico',
  description: 'Plataforma de preparación para el Examen de Residentado Médico del MINSA y EsSalud.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={geist.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}