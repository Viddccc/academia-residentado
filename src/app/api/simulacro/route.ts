import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const { score, answers } = await req.json()

    const attempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        score,
        answers,
      },
    })

    return NextResponse.json({ attemptId: attempt.id, score })
  } catch (error) {
    console.error('Error simulacro:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}