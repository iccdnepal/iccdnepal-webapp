"use client"

import { useState } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/app-components/ui/button"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

// Type definition for Program
interface Program {
    id: string
    title: string
    category: string
    level: string
    slug: string
}

function SortableItem({ program, onDelete }: { program: Program; onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: program.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: isDragging ? "relative" as const : undefined,
        backgroundColor: isDragging ? "var(--background)" : undefined,
        boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.1)" : undefined,
    }

    return (
        <tr ref={setNodeRef} style={style} className="group border-b border-border hover:bg-muted/50 transition-colors">
            <td className="w-[50px] p-4">
                <button {...attributes} {...listeners} className="cursor-grab hover:text-primary active:cursor-grabbing">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </button>
            </td>
            <td className="p-4 font-medium">{program.title}</td>
            <td className="p-4">{program.category}</td>
            <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${program.level === 'Foundation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        program.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {program.level}
                </span>
            </td>
            <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                    <Link href={`/admin/programs/${program.slug}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(program.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </td>
        </tr>
    )
}

export function ProgramListSortable({ initialPrograms }: { initialPrograms: Program[] }) {
    const [programs, setPrograms] = useState(initialPrograms)
    const router = useRouter()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            setPrograms((items) => {
                const oldIndex = items.findIndex((p) => p.id === active.id)
                const newIndex = items.findIndex((p) => p.id === over.id)
                const newOrder = arrayMove(items, oldIndex, newIndex)

                // Send new order to API
                fetch("/api/programs/reorder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ programIds: newOrder.map((p) => p.id) }),
                }).then(res => {
                    if (!res.ok) throw new Error("Failed to update order")
                    toast.success("Program order updated successfully")
                    router.refresh()
                }).catch(err => {
                    console.error(err)
                    toast.error("Failed to update program order")
                    setPrograms(initialPrograms) // Revert on error
                })

                return newOrder
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this program?")) return

        try {
            const res = await fetch(`/api/programs?id=${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete program")

            setPrograms(programs.filter(p => p.id !== id))
            toast.success("Program deleted successfully")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete program")
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="bg-card shadow-sm rounded-lg border border-border overflow-hidden">
                <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase">
                            <tr>
                                <th className="w-[50px] px-4 py-3"></th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Level</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <SortableContext
                                items={programs.map(p => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {programs.map((program) => (
                                    <SortableItem
                                        key={program.id}
                                        program={program}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </SortableContext>
                            {programs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No programs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DndContext>
    )
}
