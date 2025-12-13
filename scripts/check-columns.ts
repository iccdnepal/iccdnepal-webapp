import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkColumns() {
    try {
        const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Program' AND column_name = 'order';
    `
        console.log('Order column check:', columns)
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkColumns()
