import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    // 'relative' aur 'overflow-hidden' zaroori hai overlay ke liye
    <Card className="border-none shadow-none relative overflow-hidden">
      
      {/* --- LOADING OVERLAY START --- */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
           <img 
             src="/loading.gif" 
             alt="Loading..." 
             className="w-24 h-24 object-contain" 
           />
        </div>
      )}
      {/* --- LOADING OVERLAY END --- */}

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
            <Input id="email" type="email" placeholder="name@example.com" disabled={loading} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" disabled={loading} required />
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