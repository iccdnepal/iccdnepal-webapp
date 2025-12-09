"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/app-components/ui/button"

interface NotificationStats {
    count: number
    details: {
        proposals: number
        contacts: number
    }
}

export function Notifications() {
    const [stats, setStats] = useState<NotificationStats>({ count: 0, details: { proposals: 0, contacts: 0 } })
    const [isOpen, setIsOpen] = useState(false)

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/notifications")
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (error) {
            console.error("Failed to fetch notifications")
        }
    }

    useEffect(() => {
        fetchStats()
        // Poll every minute
        const interval = setInterval(fetchStats, 60000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {stats.count > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                )}
            </Button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 rounded-md border border-border bg-card shadow-lg z-50 py-1">
                        <div className="px-4 py-2 border-b border-border text-xs font-semibold text-muted-foreground">
                            Notifications
                        </div>
                        {stats.count === 0 ? (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                                No new notifications
                            </div>
                        ) : (
                            <div className="py-1">
                                {stats.details.proposals > 0 && (
                                    <Link
                                        href="/admin/proposals"
                                        className="block px-4 py-2.5 text-sm hover:bg-secondary/10 hover:text-secondary transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="font-medium">New Proposals ({stats.details.proposals})</div>
                                        <div className="text-xs text-muted-foreground">Check pending requests</div>
                                    </Link>
                                )}
                                {stats.details.contacts > 0 && (
                                    <Link
                                        href="/admin/contact"
                                        className="block px-4 py-2.5 text-sm hover:bg-secondary/10 hover:text-secondary transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="font-medium">New Messages ({stats.details.contacts})</div>
                                        <div className="text-xs text-muted-foreground">Check inbox</div>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
