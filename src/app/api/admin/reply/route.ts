import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { auth } from "@/auth"

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
        // Security Check
        const session = await auth()
        if (!session?.user?.email || session.user.email !== "admin@iccdnepal.com") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { to, subject, message, originalContext } = await req.json()

        if (!to || !message) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: to,
            bcc: "admin@iccdnepal.com", // Keeping a copy for admin
            subject: `Re: ${subject}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <p>${message.replace(/\n/g, '<br/>')}</p>
                    <br/>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #888; font-size: 12px;">Replying to:</p>
                    <blockquote style="border-left: 2px solid #ddd; padding-left: 10px; color: #666; font-size: 13px;">
                        ${originalContext}
                    </blockquote>
                    <br/>
                    <p style="color: #888; font-size: 12px;">Sent from ICCD Admin Dashboard</p>
                </div>
            `,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Reply error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
