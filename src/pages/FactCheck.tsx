import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Calendar, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const FactCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const newsItem = location.state?.newsItem;

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
          <p className="text-muted-foreground mb-6">Please select a news item from the gallery to view its fact-check.</p>
          <Button onClick={() => navigate('/gallery')}>Go to Gallery</Button>
        </Card>
      </div>
    );
  }

  // Mock credibility score based on category
  const credibilityScore = newsItem.category === "Technology" ? 92 : 
                          newsItem.category === "Environment" ? 95 :
                          newsItem.category === "Politics" ? 78 : 88;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getVerificationStatus = (score: number) => {
    if (score >= 80) return { label: "Verified", icon: CheckCircle2, color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" };
    if (score >= 60) return { label: "Questionable", icon: AlertTriangle, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };
    return { label: "False", icon: XCircle, color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" };
  };

  const status = getVerificationStatus(credibilityScore);
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/gallery')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Button>

        <div className="space-y-6 animate-fade-in">
          {/* Header Card */}
          <Card className="overflow-hidden">
            <div className="relative h-64">
              <img
                src={newsItem.image}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={status.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                  <Badge variant="outline">{newsItem.category}</Badge>
                </div>
                <h1 className="text-3xl font-bold">{newsItem.title}</h1>
              </div>
            </div>
          </Card>

          {/* Credibility Score */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Credibility Score</h2>
              </div>
              <span className={`text-4xl font-bold ${getScoreColor(credibilityScore)}`}>
                {credibilityScore}%
              </span>
            </div>
            <Progress value={credibilityScore} className="h-3" />
          </Card>

          {/* Analysis Details */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Verification Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Publication Date
                </h3>
                <p className="text-muted-foreground">{newsItem.date}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground">{newsItem.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Key Findings</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Multiple credible sources confirm the main claims</li>
                  <li>Official documentation and statements support the narrative</li>
                  <li>No evidence of image manipulation or misinformation detected</li>
                  <li>Timeline and facts align with verified records</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Source Analysis */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Source Credibility</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold">Official Source</p>
                  <p className="text-sm text-muted-foreground">Primary verification source</p>
                </div>
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                  Highly Reliable
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold">Independent Fact-Checkers</p>
                  <p className="text-sm text-muted-foreground">Cross-verification completed</p>
                </div>
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                  Verified
                </Badge>
              </div>
            </div>
          </Card>

          {/* Related Articles */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Related Fact-Checks</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <p className="font-medium">Related verification #{i} for similar claims</p>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>

          {/* Official Source Link */}
          <Card className="p-6 bg-primary/5">
            <a
              href={newsItem.source}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold mb-1">View Official Source</h3>
                <p className="text-sm text-muted-foreground">
                  Access the original verified publication
                </p>
              </div>
              <ExternalLink className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FactCheck;
