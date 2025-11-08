import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Flame, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type TrendingTopic = {
  query: string;
  count: number;
  isReal: number;
  isFake: number;
};

export const TrendingNews = () => {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  const fetchTrendingTopics = async () => {
    try {
      // Get searches from the past week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await (supabase as any)
        .from("search_history")
        .select("query_text, result")
        .gte("created_at", oneWeekAgo.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Aggregate topics
      const topicMap = new Map<string, { count: number; real: number; fake: number }>();

      data?.forEach((item: any) => {
        // Get first 100 chars as topic identifier
        const topic = item.query_text.substring(0, 100).trim();
        const result = item.result as any;
        const isReal = result?.isReal ? 1 : 0;
        const isFake = result?.isReal ? 0 : 1;

        if (topicMap.has(topic)) {
          const existing = topicMap.get(topic)!;
          topicMap.set(topic, {
            count: existing.count + 1,
            real: existing.real + isReal,
            fake: existing.fake + isFake,
          });
        } else {
          topicMap.set(topic, { count: 1, real: isReal, fake: isFake });
        }
      });

      // Convert to array and sort by count
      const trending = Array.from(topicMap.entries())
        .map(([query, stats]) => ({
          query,
          count: stats.count,
          isReal: stats.real,
          isFake: stats.fake,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setTrendingTopics(trending);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Flame className="h-6 w-6 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Loading trending topics...</h2>
        </div>
      </Card>
    );
  }

  if (trendingTopics.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <Flame className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Trending This Week</h2>
      </div>

      <div className="space-y-4">
        {trendingTopics.map((topic, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-2 line-clamp-2">{topic.query}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {topic.count} {topic.count === 1 ? "search" : "searches"}
                  </span>
                  {topic.isReal > 0 && (
                    <span className="text-success">✓ {topic.isReal} verified real</span>
                  )}
                  {topic.isFake > 0 && (
                    <span className="text-destructive">✗ {topic.isFake} flagged fake</span>
                  )}
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Most verified news topics from the past 7 days
      </p>
    </Card>
  );
};
