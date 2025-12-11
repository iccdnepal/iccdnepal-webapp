"use client"

import { useState } from "react"
import { Button } from "@/app-components/ui/button"
import { Input } from "@/app-components/ui/input"
import { Label } from "@/app-components/ui/label"
import { Loader2, Mail } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/password-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, type: "request" }),
            })

            if (!res.ok) throw new Error("Request failed")

            setSubmitted(true)
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleBackToLogin = () => {
        router.push('/admin/login')
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <div className="text-center space-y-4">
                        <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="h-6 w-6 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Check your email</h2>
                        <p className="text-slate-400">
                            If an account exists for {email}, we have sent password reset instructions.
                        </p>
                        <Button 
                            onClick={handleBackToLogin}
                            className="w-full bg-secondary hover:bg-secondary/90 text-white"
                        >
                            Return to Login
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Forgot Password</h1>
                    <p className="text-slate-400">Enter your email to receive reset instructions</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50"
                            placeholder="admin@iccdnepal.com"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white h-11"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                    </Button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="text-sm text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}