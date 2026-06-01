import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  // Categorías
  const categorias = await Promise.all([
    db.category.upsert({ where: { slug: 'medicina-interna' }, update: {}, create: { name: 'Medicina Interna', slug: 'medicina-interna' } }),
    db.category.upsert({ where: { slug: 'pediatria' }, update: {}, create: { name: 'Pediatría', slug: 'pediatria' } }),
    db.category.upsert({ where: { slug: 'cirugia' }, update: {}, create: { name: 'Cirugía', slug: 'cirugia' } }),
    db.category.upsert({ where: { slug: 'ginecologia' }, update: {}, create: { name: 'Ginecología', slug: 'ginecologia' } }),
    db.category.upsert({ where: { slug: 'psiquiatria' }, update: {}, create: { name: 'Psiquiatría', slug: 'psiquiatria' } }),
    db.category.upsert({ where: { slug: 'salud-publica' }, update: {}, create: { name: 'Salud Pública', slug: 'salud-publica' } }),
  ])

  console.log('✅ Categorías creadas')

  // Cursos
  const cursos = [
    { title: 'Cardiología y aparato cardiovascular', description: 'Domina los temas de cardiología más frecuentes en el examen de residentado: HTA, ICC, arritmias, cardiopatía isquémica y más.', price: 79, thumbnail: '🫀', categoryId: categorias[0].id, published: true },
    { title: 'Neumología y aparato respiratorio', description: 'Cubre EPOC, asma, neumonías, tuberculosis y síndrome de distress respiratorio con enfoque en el examen.', price: 69, thumbnail: '🫁', categoryId: categorias[0].id, published: true },
    { title: 'Gastroenterología', description: 'Hepatitis, cirrosis, úlcera péptica, síndrome de malabsorción y emergencias gastrointestinales.', price: 79, thumbnail: '🫀', categoryId: categorias[0].id, published: true },
    { title: 'Neonatología y pediatría general', description: 'Atención del recién nacido, desarrollo psicomotor, enfermedades infecciosas pediátricas y urgencias en niños.', price: 69, thumbnail: '👶', categoryId: categorias[1].id, published: true },
    { title: 'Cirugía general y trauma', description: 'Abdomen agudo, apendicitis, trauma abdominal, hernias y principios de cirugía de emergencia.', price: 89, thumbnail: '🔬', categoryId: categorias[2].id, published: true },
    { title: 'Obstetricia y ginecología', description: 'Control prenatal, parto normal y patológico, preeclampsia, hemorragias obstétricas y patología ginecológica.', price: 79, thumbnail: '🩺', categoryId: categorias[3].id, published: true },
    { title: 'Psiquiatría clínica', description: 'Trastornos del estado de ánimo, psicosis, ansiedad, adicciones y psicofarmacología esencial.', price: 59, thumbnail: '🧠', categoryId: categorias[4].id, published: true },
    { title: 'Salud pública y epidemiología', description: 'Indicadores de salud, vigilancia epidemiológica, programas de salud del MINSA y estadística aplicada.', price: 69, thumbnail: '📊', categoryId: categorias[5].id, published: true },
  ]

  for (const curso of cursos) {
    await db.course.upsert({
      where: { id: curso.title },
      update: {},
      create: curso,
    }).catch(async () => {
      await db.course.create({ data: curso })
    })
  }

  console.log('✅ Cursos creados')

  // Especialidades para simulacro
  const especialidades = await Promise.all([
    db.specialty.upsert({ where: { slug: 'medicina-interna' }, update: {}, create: { name: 'Medicina Interna', slug: 'medicina-interna' } }),
    db.specialty.upsert({ where: { slug: 'pediatria' }, update: {}, create: { name: 'Pediatría', slug: 'pediatria' } }),
    db.specialty.upsert({ where: { slug: 'cirugia' }, update: {}, create: { name: 'Cirugía', slug: 'cirugia' } }),
  ])

  console.log('✅ Especialidades creadas')

  // Preguntas de muestra
  const preguntas = [
    {
      text: 'Paciente de 58 años con HTA presenta dolor torácico opresivo de 2 horas con supradesnivel ST en V1-V4. ¿Cuál es la conducta inmediata?',
      options: ['Heparina IV + ecocardiograma', 'AAS + nitroglicerina + O₂ + morfina', 'Trombolisis inmediata con alteplase', 'Traslado a UCI sin intervención'],
      correctAnswer: 1,
      explanation: 'El IAM con STESS requiere tratamiento inmediato con AAS, nitroglicerina, oxígeno y morfina mientras se prepara la reperfusión.',
      specialtyId: especialidades[0].id,
    },
    {
      text: 'Niño de 3 años con fiebre de 39°C, odinofagia y exudado amigdalino. Score de Centor: 4. ¿Cuál es el tratamiento de elección?',
      options: ['Amoxicilina 50mg/kg/día por 10 días', 'Azitromicina 10mg/kg/día por 5 días', 'Ibuprofeno y observación', 'Ceftriaxona IM dosis única'],
      correctAnswer: 0,
      explanation: 'La amoxicilina es el antibiótico de primera línea para faringoamigdalitis estreptocócica en pediatría.',
      specialtyId: especialidades[1].id,
    },
    {
      text: 'Paciente con dolor abdominal en FID de 12 horas, fiebre 38.5°C, leucocitosis 14,000. Signo de McBurney positivo. ¿Diagnóstico más probable?',
      options: ['Colecistitis aguda', 'Apendicitis aguda', 'Enfermedad de Crohn', 'Hernia inguinal complicada'],
      correctAnswer: 1,
      explanation: 'El cuadro clínico clásico con signo de McBurney positivo es diagnóstico de apendicitis aguda.',
      specialtyId: especialidades[2].id,
    },
  ]

  for (const pregunta of preguntas) {
    await db.question.create({ data: pregunta })
  }

  console.log('✅ Preguntas creadas')
  console.log('🎉 Seed completado exitosamente')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())