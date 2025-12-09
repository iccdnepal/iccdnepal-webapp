// /app/admin/reset-password/ResetPasswordForm.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/app-components/ui/button"
import { Input } from "@/app-components/ui/input"
import { Label } from "@/app-components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()  

    const token = searchParams.get("token")
    const email = searchParams.get("email")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!token || !email) {
            setError("Invalid reset link. Please request a new one.")
        }
    }, [token, email])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/password-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "reset",
                    email,
                    token,
                    newPassword: password
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Reset failed")

            setSuccess(true)
            setTimeout(() => router.push("/admin/login"), 3000)
        } catch (err: any) {
            setError(err.message || "Something went wrong. Link might be expired.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
                <div className="max-w-md w-full space-y-8 p-8 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
                    <div className="text-center space-y-4">
                        <div className="h-12 w-12 flex items-center justify-center mx-auto rounded-full bg-green-500/10">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
                        <p className="text-slate-400">
                            Your password has been successfully updated. Redirecting to login...
                        </p>
                        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                            <Link href="/admin/login">Go to Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="max-w-md w-full space-y-8 p-8 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white">Set New Password</h1>
                    <p className="text-slate-400">Enter your new secure password below</p>
                </div>

                {!error || error.includes("Password") ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-200">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50"
                            />
                        </div>

                        {error && (
                            <div className="text-center text-sm text-red-400 p-3 rounded-lg border border-red-500/20 bg-red-500/10">
                                {error}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full h-11 bg-primary hover:bg-primary/90 text-white">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reset Password
                        </Button>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400">{error}</div>
                        <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/10">
                            <Link href="/admin/forgot-password">Request New Link</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
