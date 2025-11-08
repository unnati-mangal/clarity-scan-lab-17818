import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, Search, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type WeeklyData = {
  week: string;
  users: number;
};

const Analytics = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSearches, setTotalSearches] = useState(0);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      if (session.user.email !== "admin@truthguard.com") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view analytics",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await fetchAnalytics();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    // Fetch total users
    const { count: userCount } = await (supabase as any)
      .from("profiles")
      .select("*", { count: "exact", head: true });

    setTotalUsers(userCount || 0);

    // Fetch total searches
    const { count: searchCount } = await (supabase as any)
      .from("search_history")
      .select("*", { count: "exact", head: true });

    setTotalSearches(searchCount || 0);

    // Fetch weekly user growth
    const { data: profiles } = await (supabase as any)
      .from("profiles")
      .select("created_at")
      .order("created_at", { ascending: true });

    if (profiles) {
      const weeklyMap = new Map<string, number>();
      
      profiles.forEach((profile: any) => {
        const date = new Date(profile.created_at);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split("T")[0];
        
        weeklyMap.set(weekKey, (weeklyMap.get(weekKey) || 0) + 1);
      });

      const chartData: WeeklyData[] = Array.from(weeklyMap.entries())
        .map(([week, users]) => ({
          week: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          users,
        }))
        .slice(-8); // Last 8 weeks

      setWeeklyData(chartData);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-accent/10">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Searches</p>
                <p className="text-3xl font-bold">{totalSearches}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg per User</p>
                <p className="text-3xl font-bold">
                  {totalUsers > 0 ? (totalSearches / totalUsers).toFixed(1) : 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">User Growth (Weekly)</h2>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
