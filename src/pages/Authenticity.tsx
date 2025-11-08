import { Shield, CheckCircle2, AlertTriangle, Info, Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Authenticity = () => {
  const [headline, setHeadline] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<string>("");
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!headline.trim()) {
      toast({
        title: "Error",
        description: "Please enter a news headline to verify",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke('verify-news', {
        body: { headline }
      });

      if (error) {
        if (error.message.includes('429')) {
          toast({
            title: "Rate Limit Reached",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
        } else if (error.message.includes('402')) {
          toast({
            title: "Credits Required",
            description: "Please add credits to continue using the verification service.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setResult(data.analysis);
      toast({
        title: "Verification Complete",
        description: "Analysis has been generated successfully",
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "An error occurred while verifying the headline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">News Authenticity Verification</h1>
          <p className="text-xl text-muted-foreground">
            How we verify and authenticate news content
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 hover:shadow-[var(--shadow-glow)] transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Verified Sources</h3>
                <p className="text-muted-foreground">
                  We cross-reference news with official sources, government databases, 
                  and reputable news organizations to ensure accuracy.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-[var(--shadow-glow)] transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced AI models analyze content patterns, check metadata, 
                  and detect manipulated images or deepfakes.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-[var(--shadow-glow)] transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Fact-Checking Network</h3>
                <p className="text-muted-foreground">
                  Connected to international fact-checking organizations and 
                  databases to validate claims and statements.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-[var(--shadow-glow)] transition-all">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Multi-Layer Verification</h3>
                <p className="text-muted-foreground">
                  Multiple verification layers including source credibility, 
                  content analysis, and historical data comparison.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Verification Demo */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Live Verification Demo</h2>
              <p className="text-muted-foreground">Test our AI-powered fact-checking in real-time</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter a news headline to verify..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                className="flex-1"
                disabled={isVerifying}
              />
              <Button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="min-w-[120px]"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </div>

            {result && (
              <Card className="p-6 bg-background animate-fade-in">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Verification Analysis
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground">{result}</p>
                </div>
              </Card>
            )}

            {!result && !isVerifying && (
              <div className="text-center p-8 text-muted-foreground">
                <p className="text-sm">Enter a headline above to see instant AI-powered verification</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
          <h2 className="text-2xl font-bold mb-4">Verification Process</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Source Identification</h4>
                <p className="text-muted-foreground">
                  Identify and verify the original source of the news content
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Content Analysis</h4>
                <p className="text-muted-foreground">
                  AI-powered analysis of text, images, and metadata for inconsistencies
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Cross-Reference Check</h4>
                <p className="text-muted-foreground">
                  Compare with multiple trusted sources and databases
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Authenticity Score</h4>
                <p className="text-muted-foreground">
                  Generate a comprehensive authenticity score with detailed breakdown
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Authenticity;
