import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// Initialize PrismaClient without explicit datasources
// It will automatically use the DATABASE_URL from the schema/environment
export const prisma =
  global.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma