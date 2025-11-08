import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Verify", path: "/search" },
  { name: "History", path: "/history" },
  { name: "News Hub", path: "/news-knowledge" },
  { name: "Gallery", path: "/gallery" },
  { name: "Authenticity", path: "/authenticity" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all">
              <Shield className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                TruthGuard
              </span>
              <p className="text-xs text-muted-foreground">News Verification</p>
            </div>
          </Link>

          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative px-4 py-2 font-medium rounded-lg transition-all duration-300",
                  "hover:bg-primary/10 hover:text-primary hover:shadow-[var(--shadow-hover)]",
                  "before:absolute before:inset-0 before:rounded-lg before:opacity-0",
                  "before:bg-gradient-to-r before:from-primary/20 before:to-accent/20",
                  "before:transition-opacity hover:before:opacity-100",
                  location.pathname === item.path
                    ? "text-primary bg-primary/10 shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
