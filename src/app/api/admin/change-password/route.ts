import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { currentPassword, newPassword } = await req.json()

        if (!currentPassword || !newPassword) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        if (newPassword.length < 6) {
            return new NextResponse("Password must be at least 6 characters", { status: 400 })
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        // Verify current password
        const passwordsMatch = await bcrypt.compare(currentPassword, user.password)
        if (!passwordsMatch) {
            return new NextResponse("Current password is incorrect", { status: 401 })
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword }
        })

        return NextResponse.json({ message: "Password updated successfully" })
    } catch (error) {
        console.error("Change password error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
