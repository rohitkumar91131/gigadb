import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <div className="container px-4 md:px-8 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 mb-8">
          v.0 is now live
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl mb-6">
          The Database for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Scalable Applications
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground mb-8">
          Experience lightning-fast queries, real-time sync, and infinite scalability. 
          Stop managing infrastructure and start building your product.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth/signup">
            <Button size="lg" className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700">
              <Database className="mr-2 h-5 w-5" /> Create Your Database
            </Button>
          </Link>
          <Link to="/docs">
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
              Read Documentation
            </Button>
          </Link>
        </div>

        {/* Abstract Visual / Grid Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
    </section>
  );
}