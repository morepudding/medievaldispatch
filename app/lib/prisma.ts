import { PrismaClient } from '@prisma/client'

// Singleton pour éviter de créer trop de connexions en dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configuration Prisma 7 avec URL depuis prisma.config.ts
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
