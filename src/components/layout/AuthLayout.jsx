import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left Side - Visuals (Image spread across full height/width) */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 text-white ">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/logo.png" 
            alt="GigaDB Background" 
            className="w-full h-full object-cover opacity-60" 
          />
          {/* Note: opacity-60 lagaya hai taaki text dikhe. 
              Agar image dark hai to opacity hata sakte ho */}
        </div>

        {/* Content Layer (Z-Index se upar rakha hai) */}
        <div className="relative z-10 flex items-center gap-2 text-2xl font-bold">
           {/* Agar logo icon bhi chahiye to yahan chhota img rakh sakte ho, warna sirf text */}
           GigaDB
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than
              ever before.&rdquo;
            </p>
            <footer className="text-sm text-zinc-300">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - The Forms */}
      <div className="flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px] flex flex-col justify-center space-y-6">
          
          {/* Mobile Logo (Thoda bada kar diya hai) */}
          <div className="flex lg:hidden items-center justify-center gap-2 text-2xl font-bold mb-8">
            <img 
              src="/logo.png" 
              alt="GigaDB Logo" 
              className="w-16 h-16 object-contain" 
            />
            <span>GigaDB</span>
          </div>
          
          <Outlet />
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}