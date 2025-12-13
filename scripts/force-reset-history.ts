import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function forceResetHistory() {
    try {
        // Check if table exists
        const result = await prisma.$queryRaw`
      SELECT exists (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = '_prisma_migrations'
      );
    `
        console.log('Table exists check:', result)

        console.log('🗑️  Attempting to drop _prisma_migrations table...')
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "public"."_prisma_migrations" CASCADE;`)
        console.log('✅ Drop command executed.')

        // Verify it's gone
        const checkAfter = await prisma.$queryRaw`
      SELECT exists (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = '_prisma_migrations'
      );
    `
        console.log('Table exists check after drop:', checkAfter)

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

forceResetHistory()
