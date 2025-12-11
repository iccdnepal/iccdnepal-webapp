import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
    },
});

// ============================
// POST /api/auth/password-reset
// ============================
export async function POST(req: Request) {
    try {
        const { email, type, token, newPassword } = await req.json();

        // ========================
        // 1. REQUEST RESET LINK
        // ========================
        if (type === "request") {
            const user = await prisma.user.findUnique({ where: { email } });

            // Security best practice: never confirm user existence
            if (!user) {
                return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
            }

            // 32-byte token → hex string sent to user
            const rawToken = crypto.randomBytes(32).toString("hex");

            // Hash stored in DB (so attackers can't reuse stolen DB tokens)
            const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

            const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

            // STORE or UPDATE token (keyed by email)
            await prisma.passwordResetToken.upsert({
                where: { email }, // MUST MATCH your model (email UNIQUE)
                create: {
                    email,
                    token: hashedToken,
                    expires,
                },
                update: {
                    token: hashedToken,
                    expires,
                },
            });

            // Send mail ONLY if env variables exist
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${rawToken}&email=${email}`;

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Reset Your Password",
                    html: `
                        <p>You requested a password reset.</p>
                        <p>Click here to reset your password:</p>
                        <a href="${resetUrl}" 
                           style="padding:12px 20px;background:#0A2E52;color:white;border-radius:6px;text-decoration:none;font-weight:600;">
                           Reset Password
                        </a>
                        <p>This link expires in 1 hour.</p>
                    `
                });
            }

            return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
        }

        // ========================
        // 2. RESET PASSWORD
        // ========================
        if (type === "reset") {
            if (!email || !token || !newPassword) {
                return new NextResponse("Missing fields", { status: 400 });
            }

            const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

            const resetDoc = await prisma.passwordResetToken.findUnique({
                where: { email },
            });

            if (
                !resetDoc ||
                resetDoc.token !== hashedToken ||
                resetDoc.expires < new Date()
            ) {
                return new NextResponse("Invalid or expired token", { status: 400 });
            }

            // Update password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword },
            });

            // Delete used token
            await prisma.passwordResetToken.delete({ where: { email } });

            return NextResponse.json({ message: "Password reset successful." });
        }

        return new NextResponse("Invalid type", { status: 400 });

    } catch (err) {
        console.error("Password reset error:", err);
        return new NextResponse("Server error", { status: 500 });
    }
}
