const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

db.user.update({
  where: { email: 'viddccc@gmail.com' },
  data: { role: 'ADMIN' },
}).then((u) => {
  console.log('✅ Rol actualizado:', u.role)
  db.$disconnect()
}).catch((e) => {
  console.error('❌ Error:', e.message)
  db.$disconnect()
})