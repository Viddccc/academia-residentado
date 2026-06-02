import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { token, cursoId, amount, email } = await req.json()

    // Procesar cargo con Culqi
    const culqiRes = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CULQI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency_code: 'PEN',
        email,
        source_id: token,
        description: 'MedPrep Academy — Curso',
      }),
    })

    const culqiData = await culqiRes.json()

    if (!culqiRes.ok || culqiData.object === 'error') {
      return NextResponse.json(
        { error: culqiData.user_message || 'Error al procesar el pago' },
        { status: 400 }
      )
    }

    // Obtener usuario
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Crear orden
    const orden = await db.order.create({
      data: {
        userId: user.id,
        total: amount / 100,
        status: 'PAID',
        paymentId: culqiData.id,
        items: cursoId && cursoId !== 'plan-mensual' ? {
          create: {
            courseId: cursoId,
            price: amount / 100,
          }
        } : undefined,
      },
    })

    // Activar acceso al curso
    if (cursoId && cursoId !== 'plan-mensual') {
      await db.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: cursoId,
          }
        },
        update: {},
        create: {
          userId: user.id,
          courseId: cursoId,
          progress: 0,
        },
      })
    } else {
      // Plan mensual — inscribir en todos los cursos
      const cursos = await db.course.findMany({
        where: { published: true },
      })

      for (const curso of cursos) {
        await db.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: curso.id,
            }
          },
          update: {},
          create: {
            userId: user.id,
            courseId: curso.id,
            progress: 0,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      orderId: orden.id,
      chargeId: culqiData.id,
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}