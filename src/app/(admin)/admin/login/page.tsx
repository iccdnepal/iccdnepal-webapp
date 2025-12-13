import { auth } from "@/auth"
import { redirect } from "next/navigation"
import LoginForm from "./login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Admin Login | ICCD Nepal',
    description: 'Login to access the admin dashboard',
}

export default async function LoginPage() {
    const session = await auth()

    if (session?.user) {
        redirect("/admin/dashboard")
    }

    return <LoginForm />
}