"use client"

import { useState } from "react"
import { Button } from "@/app-components/ui/button"
import { Input } from "@/app-components/ui/input"
import { Label } from "@/app-components/ui/label"
import { Loader2, Mail, Lock, KeyRound } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify"

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1) // 1 = Email, 2 = OTP + Password
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    // Step 1: Request OTP
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/password-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, type: "request" }),
            })

            if (!res.ok) throw new Error("Failed to send OTP")

            toast.success("OTP sent to your email!")
            setStep(2)
        } catch (err) {
            setError("Something went wrong. Please try again.")
            toast.error("Failed to send OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            toast.error("Passwords do not match")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            toast.error("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/password-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    type: "reset",
                    otp,
                    newPassword: password
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Reset failed")

            // Success! Redirect to login
            toast.success("Password reset successfully!")
            router.push('/admin/login')
        } catch (err: any) {
            setError(err.message || "Invalid OTP or unexpected error")
            toast.error(err.message || "Reset failed")
        } finally {
            setLoading(false)
        }
    }

    const handleBackToLogin = () => {
        router.push('/admin/login')
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {step === 1 ? "Forgot Password" : "Reset Password"}
                    </h1>
                    <p className="text-slate-400">
                        {step === 1
                            ? "Enter your email to receive an OTP code"
                            : "Enter the verification code sent to your email"}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleRequestOtp} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50"
                                placeholder="Enter Your Email"
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
                            Send OTP Code
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-slate-200">Enter OTP Code</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                    <Input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        className="pl-10 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50 tracking-widest"
                                        placeholder="123456"
                                        maxLength={6}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-200">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pl-10 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
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
                            Reset Password
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                            >
                                Change Email
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center pt-2 border-t border-white/10">
                    <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="text-sm text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    )
}