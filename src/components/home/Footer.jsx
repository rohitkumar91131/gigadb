import { Link } from "react-router-dom";
import { Hexagon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="container px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl">
             <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
             <span>GigaDB</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The modern database platform for developers who want to ship faster.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="#" className="hover:text-primary">Database</Link></li>
            <li><Link to="#" className="hover:text-primary">Authentication</Link></li>
            <li><Link to="#" className="hover:text-primary">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="#" className="hover:text-primary">About</Link></li>
            <li><Link to="#" className="hover:text-primary">Blog</Link></li>
            <li><Link to="#" className="hover:text-primary">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="container px-4 md:px-8 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        © 2026 GigaDB Inc. All rights reserved.
      </div>
    </footer>
  );
}