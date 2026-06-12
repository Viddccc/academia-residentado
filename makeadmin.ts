import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const nuevaPassword = await bcrypt.hash('Admin2025', 12)
  
  const user = await db.user.update({
    where: { email: 'viddccc@gmail.com' },
    data: { 
      password: nuevaPassword,
      role: 'ADMIN'
    },
  })
  console.log('✅ Contraseña reseteada:', user.email)
  console.log('✅ Rol:', user.role)
  await db.$disconnect()
}

main().catch(console.error)