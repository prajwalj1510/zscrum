import { PrismaClient } from '../lib/generated/prisma'


export const prisma = globalThis.prisma || new PrismaClient() ;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma