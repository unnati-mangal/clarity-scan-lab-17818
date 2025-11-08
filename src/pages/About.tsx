import { Shield, Target, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-4">About TruthGuard</h1>
          <p className="text-xl text-muted-foreground">
            Your AI-powered partner in the fight against misinformation
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-card p-8 rounded-xl shadow-[var(--shadow-card)] animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In an era where misinformation spreads faster than truth, TruthGuard was created to empower 
              individuals with the tools they need to verify news authenticity. Our advanced AI technology 
              analyzes content patterns, cross-references with verified sources, and provides instant feedback 
              to help you make informed decisions about what you read and share.
            </p>
          </section>

          <section className="bg-card p-8 rounded-xl shadow-[var(--shadow-card)] animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              How It Works
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                TruthGuard uses state-of-the-art machine learning models trained on millions of verified and 
                false news articles. When you submit content for analysis:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Our AI extracts key information and context from your input</li>
                <li>It analyzes language patterns, source credibility, and factual consistency</li>
                <li>The system cross-references claims with verified databases</li>
                <li>You receive a clear verdict with detailed reasoning</li>
              </ol>
              <p>
                We support multiple input methods including text, image OCR, and voice transcription to 
                make verification as accessible as possible.
              </p>
            </div>
          </section>

          <section className="bg-card p-8 rounded-xl shadow-[var(--shadow-card)] animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Our Commitment
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe in transparency, accuracy, and continuous improvement. Our team regularly updates 
              our AI models with the latest verified information and refines our algorithms to stay ahead 
              of evolving misinformation tactics. Together, we can build a more informed and truthful 
              digital ecosystem.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
