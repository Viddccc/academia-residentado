import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const curso = await db.course.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!curso) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 })
    }

    return NextResponse.json(curso)
  } catch (error) {
    console.error('Error curso:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}