const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const settings = await prisma.settings.findFirst()
  console.log('Settings:', JSON.stringify(settings, null, 2))
  const bookingCount = await prisma.booking.count()
  console.log('Total bookings:', bookingCount)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
