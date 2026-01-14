import { useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const isLogout = searchParams.get("logout") === "true"
  const isReset = searchParams.get("password_reset") === "true"

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleLogin = async e => {
    e.preventDefault()
    if (loading) return

    const email = formData.email.trim().toLowerCase()

    if (!email.includes("@")) {
      toast.error("Invalid email")
      return
    }

    if (!isReset && formData.password.length < 8) {
      toast.error("Invalid password")
      return
    }

    setLoading(true)

    if (isReset) {
      setTimeout(() => {
        toast.success("Recovery link sent")
        setLoading(false)
      }, 1000)
      return
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sys/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: formData.password })
      })

      let data
      try {
        data = await res.json()
      } catch {
        throw new Error()
      }

      if (data.success) {
        toast.success("Login successful")
        setTimeout(() => navigate("/dashboard"), 800)
      } else {
        toast.error("Invalid credentials")
        setLoading(false)
      }
    } catch {
      toast.error("Server down")
      setLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-none relative overflow-hidden">

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur">
          <img src="/logo.png" className="w-56 max-h-32 object-contain logo-glow" alt="loading" />
        </div>
      )}

      <CardHeader className="px-0">
        <CardTitle>{isReset ? "Reset Password" : "Welcome back"}</CardTitle>
        <CardDescription>{isReset ? "Enter email" : "Enter credentials"}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 px-0">
        {isLogout && (
          <div className="bg-green-50 text-green-700 p-2 flex gap-2 rounded">
            <CheckCircle2 size={16} /> Logged out
          </div>
        )}

        <form onSubmit={handleLogin} className="grid gap-4">
          <Input id="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          {!isReset && <Input id="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />}
          <Button disabled={loading}>{loading ? "Please wait…" : isReset ? "Send Reset Link" : "Login"}</Button>
        </form>

        <div className="text-center text-sm">
          {isReset ? (
            <Link to="/auth/login" className="text-blue-600">Back to login</Link>
          ) : (
            <>
              No account? <Link to="/auth/signup" className="text-blue-600">Signup</Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
