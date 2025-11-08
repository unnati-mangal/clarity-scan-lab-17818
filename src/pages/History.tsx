import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, CheckCircle, XCircle, FileText, Image as ImageIcon, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SearchRecord = {
  id: string;
  query_text: string;
  query_type: string;
  result: any;
  created_at: string;
};

const History = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    fetchHistory();
  };

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("search_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from("search_history")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setHistory(history.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete record",
        variant: "destructive",
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-5 w-5" />;
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "voice":
        return <Mic className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Search History</h1>

        {history.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No search history yet. Start verifying news!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <Card key={record.id} className="p-6 hover:shadow-[var(--shadow-glow)] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="p-3 rounded-full bg-primary/10">
                      {getIcon(record.query_type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">
                          {record.query_type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="font-medium mb-2 line-clamp-2">{record.query_text}</p>

                      <div className="flex items-center gap-2">
                        {record.result.isReal ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className={record.result.isReal ? "text-success" : "text-destructive"}>
                          {record.result.isReal ? "Real News" : "Fake News"}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({(record.result.confidence * 100).toFixed(0)}% confidence)
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRecord(record.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
