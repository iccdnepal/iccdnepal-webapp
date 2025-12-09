"use client"

import { useState } from "react"
import { Button } from "@/app-components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app-components/ui/dialog"
import { Textarea } from "@/app-components/ui/textarea"
import { Input } from "@/app-components/ui/input"
import { Label } from "@/app-components/ui/label"
import { Loader2, Reply } from "lucide-react"
import { toast } from "react-toastify"

interface ReplyModalProps {
    emailTo: string
    subject: string
    originalContext: string // The message we are replying to
    trigger?: React.ReactNode
}

export function ReplyModal({ emailTo, subject, originalContext, trigger }: ReplyModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSend = async () => {
        if (!message.trim()) return

        setLoading(true)
        try {
            const res = await fetch("/api/admin/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: emailTo,
                    subject,
                    originalContext,
                    message
                })
            })

            if (!res.ok) throw new Error("Failed to send reply")

            toast.success("Reply sent successfully")
            setOpen(false)
            setMessage("")
        } catch (error) {
            console.error(error)
            toast.error("Failed to send reply")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Reply className="h-4 w-4" /> Reply
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-slate-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Reply to {emailTo}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Your reply will be sent via email.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" value={`Re: ${subject}`} disabled className="bg-slate-900 border-white/10" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-slate-900 border-white/10 min-h-[150px]"
                            placeholder="Type your reply here..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSend} disabled={loading || !message.trim()} className="bg-primary text-white">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
