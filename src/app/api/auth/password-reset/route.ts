import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import crypto from "crypto"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// Email Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export async function POST(req: Request) {
    try {
        const { email, type, token, newPassword } = await req.json()

        // 1. REQUEST RESET
        if (type === "request") {
            const user = await prisma.user.findUnique({ where: { email } })

            // Security: Don't reveal if user exists
            if (!user) {
                return NextResponse.json({ message: "If that email exists, a reset link has been sent." })
            }

            // Generate Token
            const resetToken = crypto.randomBytes(32).toString("hex")
            const passwordResetExpires = new Date(Date.now() + 3600000) // 1 hour

            // Hash token for storage
            const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

            // Upsert token for this email
            await prisma.passwordResetToken.upsert({
                where: { email }, // email is unique in your schema
                create: {
                    email,
                    token: hashedToken,
                    expires: passwordResetExpires
                },
                update: {
                    token: hashedToken,
                    expires: passwordResetExpires
                }
            })

            // Send Email
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}&email=${email}`

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Password Reset Request - ICCD Admin",
                    html: `
                        <div style="font-family: sans-serif; color: #333;">
                            <h2>Password Reset Request</h2>
                            <p>You requested a password reset for your ICCD admin account.</p>
                            <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
                            <a href="${resetUrl}" style="background-color: #E21D25; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                            <p>If you didn't request this, please ignore this email.</p>
                        </div>
                    `,
                })
            }

            return NextResponse.json({ message: "If that email exists, a reset link has been sent." })
        }

        // 2. EXECUTE RESET
        if (type === "reset") {
            if (!token || !newPassword || !email) {
                return new NextResponse("Missing required fields", { status: 400 })
            }

            const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

            const record = await prisma.passwordResetToken.findFirst({
                where: {
                    email,
                    token: hashedToken,
                    expires: { gt: new Date() }
                }
            })

            if (!record) {
                return new NextResponse("Invalid or expired token", { status: 400 })
            }

            // Update user password
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            })

            // Clean up token
            await prisma.passwordResetToken.deleteMany({ where: { email } })

            return NextResponse.json({ message: "Password reset successful" })
        }

        return new NextResponse("Invalid request type", { status: 400 })

    } catch (error) {
        console.error("Password reset error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
