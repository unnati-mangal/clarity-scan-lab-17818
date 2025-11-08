import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Image, Mic, CheckCircle, XCircle, Info, StopCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type DetectionResult = {
  isReal: boolean;
  confidence: number;
  reasoning: string;
};

const Search = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [activeTab, setActiveTab] = useState<"text" | "image" | "voice">("text");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
  };

  const saveToHistory = async (queryText: string, queryType: string, result: DetectionResult) => {
    if (!user) return;

    try {
      await (supabase as any).from("search_history").insert({
        user_id: user.id,
        query_text: queryText.substring(0, 500),
        query_type: queryType,
        result: result,
      });
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  const analyzeText = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("detect-fake-news", {
        body: { text },
      });

      if (error) throw error;

      setResult(data);
      await saveToHistory(text, "text", data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze content",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setUploadedImage(base64);
        
        const { data, error } = await supabase.functions.invoke("detect-fake-news", {
          body: { image: base64 },
        });

        if (error) throw error;
        setResult(data);
        await saveToHistory(`Image: ${file.name}`, "image", data);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process image",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processVoiceRecording(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording",
        description: "Speak now... Click stop when done.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceRecording = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        // Transcribe audio
        const { data: transcription, error: transcribeError } = await supabase.functions.invoke(
          "voice-to-text",
          { body: { audio: base64Audio } }
        );

        if (transcribeError) throw transcribeError;

        const text = transcription.text;
        setInputText(text);

        // Analyze the transcribed text
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
          "detect-fake-news",
          { body: { text } }
        );

        if (analysisError) throw analysisError;

        setResult(analysisData);
        await saveToHistory(text, "voice", analysisData);

        toast({
          title: "Success",
          description: "Voice analyzed successfully!",
        });
      };

      reader.readAsDataURL(audioBlob);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process voice",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Verify News Authenticity</h1>
          <p className="text-xl text-muted-foreground">
            Use AI to detect fake news through text, images, or voice
          </p>
        </div>

        {/* Input Method Tabs */}
        <div className="flex gap-4 mb-6 justify-center">
          <Button
            variant={activeTab === "text" ? "default" : "outline"}
            onClick={() => setActiveTab("text")}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Text
          </Button>
          <Button
            variant={activeTab === "image" ? "default" : "outline"}
            onClick={() => setActiveTab("image")}
            className="gap-2"
          >
            <Image className="h-4 w-4" />
            Image
          </Button>
          <Button
            variant={activeTab === "voice" ? "default" : "outline"}
            onClick={() => setActiveTab("voice")}
            className="gap-2"
          >
            <Mic className="h-4 w-4" />
            Voice
          </Button>
        </div>

        {/* Input Area */}
        <Card className="p-6 mb-6 shadow-[var(--shadow-card)] animate-fade-in">
          {activeTab === "text" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Paste the news article or headline you want to verify..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                className="transition-all focus:shadow-[var(--shadow-glow)]"
              />
              <Button
                onClick={() => analyzeText(inputText)}
                disabled={isAnalyzing}
                className="w-full hover:scale-105 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Text"
                )}
              </Button>
            </div>
          )}

          {activeTab === "image" && (
            <div className="space-y-4">
              {uploadedImage && (
                <div className="mb-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded content" 
                    className="max-h-64 mx-auto rounded-lg border border-border"
                  />
                </div>
              )}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Upload a screenshot or image of the news article
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isAnalyzing}
                />
                <label htmlFor="image-upload">
                  <Button asChild disabled={isAnalyzing}>
                    <span className="cursor-pointer">
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Choose Image"
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          )}

          {activeTab === "voice" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Mic className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Record your voice reading the news article
                </p>
                {!isRecording ? (
                  <Button onClick={startVoiceRecording} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Start Recording
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={stopVoiceRecording} variant="destructive">
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Results */}
        {result && (
          <Card className="p-6 shadow-[var(--shadow-card)] animate-scale-in">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${result.isReal ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {result.isReal ? (
                  <CheckCircle className="h-8 w-8 text-success" />
                ) : (
                  <XCircle className="h-8 w-8 text-destructive" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  {result.isReal ? "✅ Real News" : "❌ Fake News"}
                </h3>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Info className="h-4 w-4" />
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        result.isReal ? 'bg-success' : 'bg-destructive'
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Analysis:</h4>
                  <p className="text-muted-foreground">{result.reasoning}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Search;
