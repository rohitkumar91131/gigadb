import { Outlet, Link } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">

      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white bg-black overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-black to-black" />

        <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')]" />

        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold tracking-wide">GigaDB</span>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-3xl font-semibold leading-tight">
            A database built for speed, scale, and serious engineering.
          </p>

          <p className="mt-4 text-zinc-400">
            Index millions of records instantly.  
            Built for engineers who hate slow systems.
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          © 2026 GigaDB
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[420px] space-y-6">

          <div className="flex lg:hidden justify-center items-center gap-3 mb-8">
            <img src="/logo.png" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold">GigaDB</span>
          </div>

          <Outlet />

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-primary">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
