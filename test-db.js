const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5432/peakform?schema=public"
    }
  }
})

async function main() {
  try {
    console.log('Testing database connection...')
    const result = await prisma.$queryRaw`SELECT current_database()`
    console.log('Connected to database:', result)
  } catch (e) {
    console.error('Database connection error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()