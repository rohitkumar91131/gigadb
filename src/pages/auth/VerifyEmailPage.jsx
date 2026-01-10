import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Mail } from "lucide-react"; 

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        
        const response = await fetch(`${backendUrl}/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage("Email verified successfully! You can now login.");
        } else {
          setStatus("error");
          setMessage(data.msg || "Verification failed. Link might be expired.");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
    }
    };

    const timer = setTimeout(() => {
        verifyToken();
    }, 2000); // 2 sec delay taaki shimmer effect achhe se dikhe

    return () => clearTimeout(timer);

  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      
      {/* --- INLINE STYLE FOR SHIMMER ANIMATION --- */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <Card className="w-full max-w-md text-center shadow-lg border-none">
        <CardHeader>
            <div className="flex justify-center mb-6">
                
                {/* --- 1. LOADING STATE (SHIMMER LOGO) --- */}
                {status === "loading" && (
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-50 p-2 border border-gray-100">
                        {/* Static Logo */}
                        <img 
                            src="/logo.png" 
                            alt="Loading..." 
                            className="h-full w-full object-contain opacity-80"
                        />
                        
                        {/* Shimmer Overlay (The Moving Light) */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                    </div>
                )}

                {/* --- 2. SUCCESS STATE --- */}
                {status === "success" && (
                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                )}

                {/* --- 3. ERROR STATE --- */}
                {status === "error" && (
                    <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                        <XCircle className="h-10 w-10 text-red-600" />
                    </div>
                )}
            </div>

            <CardTitle className="text-2xl font-bold">
                {status === "loading" && "Verifying..."}
                {status === "success" && "Email Verified!"}
                {status === "error" && "Verification Failed"}
            </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
            <p className="text-muted-foreground text-md">
                {message}
            </p>

            {status === "success" && (
                <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => navigate("/auth/login")}
                >
                    Go to Login
                </Button>
            )}

            {status === "error" && (
                <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate("/auth/signup")}
                >
                    Back to Signup
                </Button>
            )}
            
            {status === "loading" && (
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Mail size={14} />
                    <span>Securely verifying your token...</span>
                </div>
            )}

        </CardContent>
      </Card>
    </div>
  );
}