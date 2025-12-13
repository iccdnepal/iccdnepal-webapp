import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugDatabase() {
    try {
        // List all tables
        const tables = await prisma.$queryRaw`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `
        console.log('--- ALL TABLES IN PUBLIC SCHEMA ---')
        console.table(tables)

        // Check _prisma_migrations specifically
        try {
            const migrations = await prisma.$queryRawUnsafe(`SELECT * FROM "_prisma_migrations"`)
            console.log('\n--- CONTENT OF _prisma_migrations ---')
            console.table(migrations)
        } catch (e) {
            console.log('\n_prisma_migrations table query failed (likely does not exist)')
        }

    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

debugDatabase()
