import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const newProposals = await prisma.proposalRequest.count({
            where: { status: "received" }
        })

        const newContacts = await prisma.contactRequest.count({
            where: { status: "new" }
        })

        return NextResponse.json({
            count: newProposals + newContacts,
            details: {
                proposals: newProposals,
                contacts: newContacts
            }
        })
    } catch (error) {
        console.error("Notifications error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
