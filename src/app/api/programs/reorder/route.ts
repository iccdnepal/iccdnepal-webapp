import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    const session = await auth()
    if (!session) return new NextResponse("Unauthorized", { status: 401 })

    try {
        const body = await req.json()
        const { programIds } = body as { programIds: string[] }

        if (!Array.isArray(programIds)) {
            return new NextResponse("Invalid request: programIds must be an array", { status: 400 })
        }

        // Update each program's order based on its position in the array
        await Promise.all(
            programIds.map((id, index) =>
                prisma.program.update({
                    where: { id },
                    data: { order: index }
                })
            )
        )

        // Revalidate admin and public pages
        revalidatePath('/admin/programs')
        revalidatePath('/programs')
        revalidatePath('/')

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
