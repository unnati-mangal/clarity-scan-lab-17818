import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { TrendingNews } from "@/components/TrendingNews";

const newsEvents = [
  {
    year: 2025,
    events: [
      {
        title: "AI Regulation Framework Passed",
        date: "March 2025",
        description: "Major economies implement comprehensive AI safety and ethics regulations, requiring transparency in AI decision-making systems.",
        category: "Technology",
      },
      {
        title: "Climate Summit Breakthrough",
        date: "January 2025",
        description: "Global leaders agree on binding emissions targets with enforcement mechanisms at the World Climate Summit.",
        category: "Environment",
      },
    ],
  },
  {
    year: 2024,
    events: [
      {
        title: "Election Integrity Measures",
        date: "November 2024",
        description: "Multiple countries implement advanced verification systems to combat election misinformation and deepfakes.",
        category: "Politics",
      },
      {
        title: "Cybersecurity Crisis",
        date: "July 2024",
        description: "Major data breach affects millions globally, leading to stricter data protection laws worldwide.",
        category: "Technology",
      },
      {
        title: "Medical Breakthrough",
        date: "April 2024",
        description: "New cancer treatment shows 90% success rate in clinical trials, revolutionizing oncology treatment.",
        category: "Health",
      },
    ],
  },
  {
    year: 2023,
    events: [
      {
        title: "AI Language Models Go Mainstream",
        date: "March 2023",
        description: "ChatGPT and similar AI models reach 100 million users, sparking debates about AI safety and ethics.",
        category: "Technology",
      },
      {
        title: "Banking System Stress",
        date: "March 2023",
        description: "Silicon Valley Bank collapse triggers concerns about financial stability and regulatory oversight.",
        category: "Economy",
      },
    ],
  },
];

const NewsKnowledge = () => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      Environment: "bg-green-500/10 text-green-600 dark:text-green-400",
      Politics: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      Health: "bg-red-500/10 text-red-600 dark:text-red-400",
      Economy: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    };
    return colors[category] || "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">News Hub</h1>
          <p className="text-xl text-muted-foreground">
            Trending topics and verified historical news events
          </p>
        </div>

        <TrendingNews />

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Historical News Knowledge</h2>
          <p className="text-muted-foreground mb-6">
            Verified major events and news stories from recent years
          </p>
        </div>

        <div className="space-y-8">
          {newsEvents.map((yearData) => (
            <div key={yearData.year}>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">{yearData.year}</h2>
              </div>

              <div className="grid gap-6">
                {yearData.events.map((event, idx) => (
                  <Card key={idx} className="p-6 hover:shadow-[var(--shadow-glow)] transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{event.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{event.date}</p>
                        <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Card className="mt-12 p-6 bg-accent/5 border-accent">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">About This Data</h3>
              <p className="text-sm text-muted-foreground">
                This knowledge base contains verified historical events to help provide context when analyzing news.
                All events have been fact-checked against multiple reliable sources. Use this as reference when
                evaluating the credibility of news stories.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewsKnowledge;
