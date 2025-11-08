import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, XCircle, Sparkles, TrendingUp, History, Newspaper } from "lucide-react";
import newsBackground from "@/assets/news-desk-background.jpeg";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-50 dark:opacity-35"
          style={{
            backgroundImage: `url(${newsBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center animate-fade-in">
              <div className="relative">
                <Shield className="h-28 w-28 text-primary mb-6 animate-scale-in" 
                       style={{ filter: 'drop-shadow(var(--shadow-glow))' }} />
              </div>
            </div>
            
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm font-semibold text-primary">AI-Powered News Verification</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in">
              Stop Fake News with
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                TruthGuard AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in leading-relaxed">
              Verify news authenticity instantly using advanced AI. Analyze text, images, and voice recordings 
              to combat misinformation and make informed decisions.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in">
              <Link to="/search">
                <Button size="lg" className="gap-2 shadow-[var(--shadow-hover)] hover:shadow-[var(--shadow-glow)] transition-all hover:scale-105 text-lg px-8 py-6">
                  <Sparkles className="h-6 w-6" />
                  Start Verifying
                </Button>
              </Link>
              <Link to="/news-knowledge">
                <Button size="lg" variant="outline" className="hover:scale-105 transition-all text-lg px-8 py-6 hover:bg-primary/5">
                  <Newspaper className="h-6 w-6 mr-2" />
                  News Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[image:var(--gradient-news)]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose TruthGuard?</h2>
            <p className="text-xl text-muted-foreground">Professional tools to combat misinformation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group p-8 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all hover:-translate-y-1">
              <div className="p-4 rounded-xl bg-success/10 w-fit mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI-Powered Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced machine learning models verify content against millions of verified sources with 95%+ accuracy.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all hover:-translate-y-1">
              <div className="p-4 rounded-xl bg-primary/10 w-fit mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Multi-Format Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Verify news through text, images with OCR, or voice recordings. Complete flexibility for your workflow.
              </p>
            </div>
            
            <div className="group p-8 rounded-2xl bg-card border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all hover:-translate-y-1">
              <div className="p-4 rounded-xl bg-accent/10 w-fit mb-6 group-hover:scale-110 transition-transform">
                <History className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Track Your Searches</h3>
              <p className="text-muted-foreground leading-relaxed">
                Keep a detailed history of all verifications for future reference and trend analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
            <TrendingUp className="h-16 w-16 mx-auto text-primary mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Verify News?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users fighting misinformation every day
            </p>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-6 shadow-[var(--shadow-hover)] hover:shadow-[var(--shadow-glow)] hover:scale-105 transition-all">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
