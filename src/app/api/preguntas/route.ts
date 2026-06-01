import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const especialidadId = searchParams.get('especialidadId')

    const preguntas = await db.question.findMany({
      where: especialidadId ? { specialtyId: especialidadId } : {},
      include: { specialty: { select: { name: true } } },
      orderBy: { createdAt: 'asc' },
    })

    // Mezclar opciones aleatoriamente
    const resultado = preguntas.map((p) => ({
      id: p.id,
      text: p.text,
      options: p.options as string[],
      correctAnswer: p.correctAnswer,
      explanation: p.explanation,
      specialty: p.specialty,
    }))

    return NextResponse.json(resultado)
  } catch (error) {
    console.error('Error preguntas:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}