import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img 
            src="/logo.png" 
            alt="GigaDB" 
            className="w-8 h-8 object-contain"
          />
          <span>GigaDB</span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          <Link to="/auth/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/auth/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}