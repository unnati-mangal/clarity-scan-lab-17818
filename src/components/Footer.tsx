import { Shield } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">TruthGuard</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Powered by AI – Detect Misinformation, Build Awareness
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 TruthGuard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
