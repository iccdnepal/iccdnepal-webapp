import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/app-components/ui/button"
import { Plus } from "lucide-react"
import { ProgramListSortable } from "@/app-components/admin/program-list-sortable"

const prisma = new PrismaClient()

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProgramsPage() {
    const programs = await prisma.program.findMany({
        orderBy: { order: 'asc' },
        select: {
            id: true,
            title: true,
            category: true,
            level: true,
            slug: true,
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Programs</h2>
                <Link href="/admin/programs/new">
                    <Button>
                        <Plus className="h-4 w-4" /> Add Program
                    </Button>
                </Link>
            </div>

            <ProgramListSortable initialPrograms={programs} />
        </div>
    )
}
