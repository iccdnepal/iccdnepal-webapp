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
        const { email, type, otp, newPassword } = await req.json();

        // ========================
        // 1. REQUEST OTP
        // ========================
        if (type === "request") {
            const user = await prisma.user.findUnique({ where: { email } });

            // Security best practice: never confirm user existence
            if (!user) {
                return NextResponse.json({ message: "If that email exists, an OTP has been sent." });
            }

            // Generate 6-digit OTP
            const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

            // Hash OTP for storage
            const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

            const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

            // STORE or UPDATE token (keyed by email)
            await prisma.passwordResetToken.upsert({
                where: { email },
                create: {
                    email,
                    token: hashedOtp,
                    expires,
                },
                update: {
                    token: hashedOtp,
                    expires,
                },
            });

            // Send mail ONLY if env variables exist
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Password Reset OTP",
                    html: `
                        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                            <h2>Password Reset Request</h2>
                            <p>Your One-Time Password (OTP) for resetting your password is:</p>
                            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #f9f9f9; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                                ${rawOtp}
                            </div>
                            <p>This code expires in 15 minutes.</p>
                            <p>If you didn't request this, please ignore this email.</p>
                        </div>
                    `
                });
            } else {
                console.log("DEV MODE OTP:", rawOtp);
            }

            return NextResponse.json({ message: "If that email exists, an OTP has been sent." });
        }

        // ========================
        // 2. VERIFY OTP & RESET
        // ========================
        if (type === "reset") {
            if (!email || !otp || !newPassword) {
                return new NextResponse("Missing fields", { status: 400 });
            }

            const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

            const resetDoc = await prisma.passwordResetToken.findUnique({
                where: { email },
            });

            if (
                !resetDoc ||
                resetDoc.token !== hashedOtp ||
                resetDoc.expires < new Date()
            ) {
                return new NextResponse("Invalid or expired OTP", { status: 400 });
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
