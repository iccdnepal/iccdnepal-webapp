// /app/admin/reset-password/page.tsx
"use client"
import dynamic from "next/dynamic"

// Dynamically import client component
const ResetPasswordForm = dynamic(() => import("./ResetPasswordForm"), { ssr: false })

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
