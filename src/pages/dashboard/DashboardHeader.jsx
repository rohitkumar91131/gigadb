import { Link, useNavigate } from "react-router-dom"
import { Bell, Settings, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardHeader() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/sys/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      )

      navigate("/")
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl mr-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="hidden md:block">GigaDB</span>
        </Link>

        {/* Center: Spacer (Pushes everything to the right) */}
        <div className="flex-1"></div>

        {/* Right: Navigation & Actions */}
        <div className="flex items-center gap-4">
          
          {/* --- NEW: Links added here (Right side) --- */}
          <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium mr-2">
            <Link 
              to="/docs" 
              className="transition-colors hover:text-foreground text-muted-foreground"
            >
              Docs
            </Link>
            <Link 
              to="/api" 
              className="transition-colors hover:text-foreground text-muted-foreground"
            >
              API
            </Link>
          </nav>
          {/* ------------------------------------------- */}

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar-placeholder.png" alt="@rohit" />
                  <AvatarFallback className="bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer focus:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}