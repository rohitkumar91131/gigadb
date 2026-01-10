import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate add kiya
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; 

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        "credentials" : "include"
      });

      const data = await response.json();

      // Check Success (True/False)
      if (data.success) {
        // Show Success msg
        toast.success(data.msg || "Account created successfully!");
        
        // Redirect to Login page after signup
        setTimeout(() => {
            navigate("/auth/login");
        }, 1500);
        
      } else {
        // Show Error msg
        toast.error(data.msg || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Server error. Is the backend running on port 3000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none relative overflow-hidden">
      
      {/* --- LOADING OVERLAY --- */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
           {/* Same loader used in Login for consistency */}
           <img 
             src="https://ezgif.com/save/ezgif-5a01c42cb9a9c573.gif" 
             alt="Loading..." 
             className="w-24 h-24 object-contain" 
           />
        </div>
      )}

      <CardHeader className="space-y-1 px-0">
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 px-0">
        <form onSubmit={handleSignup} className="grid gap-4">
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
          <Button className="w-full" disabled={loading}>
            {loading ? "Please wait..." : "Create Account"}
          </Button>
        </form>
        
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

        <div className="text-center text-sm mt-2">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}