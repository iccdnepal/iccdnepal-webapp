import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetMigrationHistory() {
    try {
        console.log('🗑️  Dropping _prisma_migrations table...')
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "_prisma_migrations";`)
        console.log('✅ Migration history reset.')
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

resetMigrationHistory()
