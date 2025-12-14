
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const email = "info@iccdnepal.com"
    const password = "adminpassword123" // Change this immediately after login!
    const hashedPassword = await bcrypt.hash(password, 10)

    // Delete existing admin users to ensure a clean slate
    await prisma.user.deleteMany({
        where: { role: "admin" }
    })
    console.log("Deleted existing admin users")

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: "admin",
            name: "ICCD Admin"
        },
    })

    console.log(`Admin user seeded: ${user.email}`)
    console.log(`Initial password: ${password}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
