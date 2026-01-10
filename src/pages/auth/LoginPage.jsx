import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; 

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  const isLogout = searchParams.get("logout") === "true";
  const isReset = searchParams.get("password_reset") === "true";
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // --- PASSWORD RESET LOGIC (Simulated) ---
    if (isReset) {
        setTimeout(() => {
            toast.success("Recovery link sent to your email!");
            setLoading(false);
        }, 1500);
        return;
    }

    // --- MAIN LOGIN LOGIC ---
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include"
        });

        const data = await response.json();

        if (data.success) {
            toast.success(data.msg || "Login successful!");
            toast.info("Redirecting to dashboard...");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } else {
            toast.error(data.msg || "Login failed");
            setLoading(false); 
        }
    } catch (error) {
        console.error("Login error:", error);
        toast.error("Network error. Backend server might be down.");
        setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none relative overflow-hidden">
      
      {/* --- LOADING OVERLAY --- */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
           <img 
             src="https://ezgif.com/save/ezgif-5a01c42cb9a9c573.gif" 
             alt="Loading..." 
             className="w-24 h-24 object-contain" 
           />
        </div>
      )}

      <CardHeader className="space-y-1 px-0">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {isReset ? "Reset Password" : "Welcome back"}
        </CardTitle>
        <CardDescription>
          {isReset 
            ? "Enter your email to receive a recovery link" 
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="grid gap-4 px-0">
        {isLogout && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-center gap-2 border border-green-200">
            <CheckCircle2 size={16} /> You have been logged out securely.
          </div>
        )}

        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                disabled={loading} 
                required 
                value={formData.email} 
                onChange={handleChange}
            />
          </div>
          
          {!isReset && (
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                disabled={loading} 
                required 
                value={formData.password}
                onChange={handleChange}
            />
            </div>
          )}

          <Button className="w-full" disabled={loading}>
            {loading ? "Please wait..." : (isReset ? "Send Reset Link" : "Sign In with Email")}
          </Button>
        </form>

        {!isReset && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" type="button" disabled={loading}>
              <Github className="mr-2 h-4 w-4" /> Github
            </Button>
          </>
        )}

        <div className="text-center text-sm mt-2">
           {isReset ? (
             <Link to="/auth/login" className="text-blue-600 hover:underline">Back to Login</Link>
           ) : (
             <>
               Don&apos;t have an account?{" "}
               <Link to="/auth/signup" className="font-semibold text-blue-600 hover:underline">
                 Sign up
               </Link>
               <br />
               <Link to="/auth/login?password_reset=true" className="text-xs text-muted-foreground hover:text-primary">
                 Forgot your password?
               </Link>
             </>
           )}
        </div>
      </CardContent>
    </Card>
  );
}