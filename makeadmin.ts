import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const user = await db.user.update({
    where: { email: 'viddccc@gmail.com' },
    data: { role: 'ADMIN' },
  })
  console.log('✅ Rol actualizado:', user.role)
  await db.$disconnect()
}

main().catch(console.error)