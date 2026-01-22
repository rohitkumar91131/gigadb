import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react"; 

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sys/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        
        const data = await response.json();
        
        if (data.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img 
            src="/logo.png" 
            alt="GigaDB" 
            className="w-8 h-8 object-contain"
          />
          <span>GigaDB</span>
        </Link>

        {/* Right Side: Links + Buttons */}
        <div className="flex items-center gap-4">
          
          {/* --- NEW: Docs & API Links --- */}
          {/* hidden md:flex ensures they hide on mobile so the navbar doesn't break */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium mr-2">
            <Link 
              to="/docs" 
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </Link>
            <Link 
              to="/api-keys" 
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              API
            </Link>
          </div>
          {/* ----------------------------- */}

          {isLoggedIn ? (
            // --- AGAR LOGIN HAI TO YE DIKHEGA ---
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <LayoutDashboard size={18} />
                Dashboard
              </Button>
            </Link>
          ) : (
            // --- AGAR LOGIN NAHI HAI TO YE DIKHEGA ---
            <>
              <Link to="/auth/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}