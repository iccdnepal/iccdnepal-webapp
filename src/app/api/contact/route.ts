import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

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
        const body = await req.json()

        const contact = await prisma.contactRequest.create({
            data: {
                name: body.name,
                email: body.email,
                org: body.org,
                role: body.role,
                interest: body.interest,
                message: body.message,
            },
        })

        // Notify Admin
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: "admin@iccdnepal.com",
                    subject: `New Contact Request - ${body.name}`,
                    html: `
                        <div style="font-family: sans-serif; color: #333;">
                            <h2>New Contact Request</h2>
                            <p><strong>Name:</strong> ${body.name}</p>
                            <p><strong>Email:</strong> ${body.email}</p>
                            <p><strong>Organization:</strong> ${body.org || "N/A"}</p>
                            <p><strong>Role:</strong> ${body.role || "N/A"}</p>
                            <p><strong>Interest:</strong> ${body.interest || "N/A"}</p>
                            <br/>
                            <p><strong>Message:</strong></p>
                            <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${body.message}</p>
                        </div>
                    `,
                })
            } catch (emailError) {
                console.error("Failed to send admin notification:", emailError)
            }
        }

        return NextResponse.json(contact)
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
