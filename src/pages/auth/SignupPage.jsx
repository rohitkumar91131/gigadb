import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSignup = async e => {
    e.preventDefault()
    if (loading) return

    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    }

    if (!payload.email.includes("@")) {
      toast.error("Invalid email")
      return
    }

    if (payload.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sys/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      })

      let data
      try {
        data = await res.json()
      } catch {
        throw new Error()
      }

      if (data.success) {
        toast.success(data.msg || "Account created")
        setTimeout(() => navigate("/auth/login"), 1200)
      } else {
        toast.error(data.msg || "Signup failed")
        setLoading(false)
      }
    } catch {
      toast.error("Server error")
      setLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-none relative overflow-hidden">

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur">
          <img src="/logo.png" className="w-56 max-h-32 object-contain  logo-glow" alt="loading" />
        </div>
      )}

      <CardHeader className="px-0">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your email</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 px-0">
        <form onSubmit={handleSignup} className="grid gap-4">
          <Input id="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <Input id="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <Button disabled={loading}>{loading ? "Please wait…" : "Create Account"}</Button>
        </form>

        <div className="text-center text-sm">
          Already have account? <Link to="/auth/login" className="text-blue-600">Login</Link>
        </div>
      </CardContent>
    </Card>
  )
}
