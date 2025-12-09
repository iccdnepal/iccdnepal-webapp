import Link from "next/link"
import { LayoutDashboard, BookOpen, MessageSquare, Mail, LogOut, Users, BarChart, FileText, HelpCircle, Image as ImageIcon, KeyRound } from "lucide-react"
import { SignOutButton } from "@/app-components/admin/sign-out-button"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Notifications } from "@/app-components/admin/notifications"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold text-primary">ICCD Admin</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/programs" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <BookOpen className="w-5 h-5" />
                        Programs
                    </Link>
                    <Link href="/admin/testimonials" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        Testimonials
                    </Link>
                    <Link href="/admin/partners" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        Partners
                    </Link>
                    <Link href="/admin/impact" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <BarChart className="w-5 h-5" />
                        Impact Metrics
                    </Link>
                    <Link href="/admin/gallery" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <ImageIcon className="w-5 h-5" />
                        Gallery
                    </Link>
                    <Link href="/admin/legal" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <FileText className="w-5 h-5" />
                        Legal Docs
                    </Link>
                    <Link href="/admin/proposals" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <Mail className="w-5 h-5" />
                        Proposals
                    </Link>
                    <Link href="/admin/contact" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <HelpCircle className="w-5 h-5" />
                        Contact Messages
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
                        <KeyRound className="w-5 h-5" />
                        Settings
                    </Link>

                </nav>

                <div className="p-4 border-t border-border">
                    <SignOutButton />
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 bg-background">
                {/* Header */}
                <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                    <h2 className="font-semibold text-lg text-foreground">Overview</h2>
                    <div className="flex items-center gap-4">
                        <Notifications />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                    <ToastContainer theme="dark" position="bottom-right" />
                </main>
            </div>
        </div>
    )
}
