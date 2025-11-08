import { Card } from "@/components/ui/card";
import { ImageIcon, Calendar, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const newsGallery = [
  {
    title: "Climate Summit 2025 Agreement",
    date: "January 15, 2025",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80",
    description: "World leaders sign historic climate agreement with binding emissions targets.",
    source: "https://unfccc.int/",
  },
  {
    title: "AI Ethics Framework Adopted",
    date: "March 20, 2025",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    description: "Global AI regulation framework ensures transparency and safety in AI systems.",
    source: "https://www.weforum.org/",
  },
  {
    title: "Medical Breakthrough in Cancer Treatment",
    date: "April 10, 2024",
    category: "Health",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    description: "Revolutionary cancer treatment shows 90% success rate in clinical trials.",
    source: "https://www.who.int/",
  },
  {
    title: "Cybersecurity Crisis Response",
    date: "July 28, 2024",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    description: "Global data breach leads to stricter data protection regulations worldwide.",
    source: "https://www.cisa.gov/",
  },
  {
    title: "Election Integrity Measures",
    date: "November 5, 2024",
    category: "Politics",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80",
    description: "Advanced verification systems combat election misinformation and deepfakes.",
    source: "https://www.eac.gov/",
  },
  {
    title: "ChatGPT Revolution",
    date: "March 15, 2023",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1676277791608-ac3b8e15b2c3?w=800&q=80",
    description: "AI language models reach 100 million users, sparking AI safety debates.",
    source: "https://openai.com/",
  },
];

const Gallery = () => {
  const navigate = useNavigate();
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      Environment: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      Politics: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      Health: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    };
    return colors[category] || "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">News Gallery</h1>
          <p className="text-xl text-muted-foreground">
            Visual archive of verified major news events and stories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsGallery.map((item, idx) => (
            <Card 
              key={idx} 
              className="overflow-hidden group hover:shadow-[var(--shadow-glow)] transition-all hover:-translate-y-1 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => navigate('/fact-check', { state: { newsItem: item } })}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(item.category)}`}>
                  {item.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>View Fact-Check Details</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
