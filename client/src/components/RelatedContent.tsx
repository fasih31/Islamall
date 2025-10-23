import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BookOpen, ScrollText, Library, Lightbulb } from "lucide-react";

interface RelatedItem {
  id: string;
  type: "quran" | "hadith" | "book" | "topic";
  title: string;
  description: string;
  link: string;
}

interface RelatedContentProps {
  currentType: "quran" | "hadith" | "book" | "topic";
  currentId: string;
  currentTitle: string;
}

export function RelatedContent({ currentType, currentId, currentTitle }: RelatedContentProps) {
  // Placeholder - in production this would fetch AI-powered recommendations
  const relatedItems: RelatedItem[] = [
    {
      id: "1",
      type: "hadith",
      title: "Related Hadith",
      description: "Authentic hadith related to this topic",
      link: "/hadith",
    },
    {
      id: "2",
      type: "book",
      title: "Recommended Reading",
      description: "Books that expand on this subject",
      link: "/books",
    },
    {
      id: "3",
      type: "topic",
      title: "Related Topics",
      description: "Explore connected themes",
      link: "/topics",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "quran":
        return BookOpen;
      case "hadith":
        return ScrollText;
      case "book":
        return Library;
      case "topic":
        return Lightbulb;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "quran":
        return "bg-emerald-500/10 text-emerald-500";
      case "hadith":
        return "bg-blue-500/10 text-blue-500";
      case "book":
        return "bg-purple-500/10 text-purple-500";
      case "topic":
        return "bg-amber-500/10 text-amber-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <Card data-testid="related-content">
      <CardHeader>
        <CardTitle>Related Content</CardTitle>
        <CardDescription>
          Explore more resources connected to {currentTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {relatedItems.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <Link key={item.id} href={item.link}>
              <div className="flex items-start gap-3 p-3 rounded-lg hover-elevate border" data-testid={`related-${item.type}-${item.id}`}>
                <div className={`p-2 rounded-md ${getTypeColor(item.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
        <p className="text-xs text-muted-foreground text-center pt-2">
          AI-powered recommendations coming soon, Insha'Allah
        </p>
      </CardContent>
    </Card>
  );
}
