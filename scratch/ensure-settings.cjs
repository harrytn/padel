const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')
const path = require('path')

async function main() {
  const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db')
  const adapter = new PrismaLibSql({
    url: `file:${dbPath}`,
  })
  const prisma = new PrismaClient({ adapter })

  console.log('Upserting settings...')
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      base_price: 60,
      racket_price_with_balls: 5,
      balls_only_price: 10,
      lighting_price: 20,
      lighting_trigger_hour: "18:00",
      peak_premium: 10,
      peak_slots: "18:00,19:30,21:00"
    }
  })
  console.log('Settings successfully ensured:', settings)
  await prisma.$disconnect()
}

main().catch(console.error)
