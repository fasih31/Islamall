import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BookMarked, History, Trash2, ExternalLink, BookText, ScrollText, Library, Lightbulb } from "lucide-react";
import { Link } from "wouter";

interface Bookmark {
  id: string;
  type: "quran" | "hadith" | "book" | "topic";
  title: string;
  subtitle?: string;
  url: string;
  timestamp: number;
}

interface HistoryItem {
  id: string;
  type: "quran" | "hadith" | "book" | "topic";
  title: string;
  url: string;
  timestamp: number;
}

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("user-bookmarks");
    const savedHistory = localStorage.getItem("user-history");
    
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed to load bookmarks:", e);
      }
    }
    
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }, []);

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("user-bookmarks", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("user-history");
  };

  const typeIcons = {
    quran: BookOpen,
    hadith: ScrollText,
    book: Library,
    topic: Lightbulb
  };

  const typeColors = {
    quran: "bg-primary/10 text-primary",
    hadith: "bg-green-500/10 text-green-600 dark:text-green-500",
    book: "bg-blue-500/10 text-blue-600 dark:text-blue-500",
    topic: "bg-amber-500/10 text-amber-600 dark:text-amber-500"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              My Dashboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your personalized Islamic learning hub. Access your bookmarks and reading history.
            </p>
          </div>

          <Tabs defaultValue="bookmarks" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="bookmarks" data-testid="tab-bookmarks">
                <BookMarked className="h-4 w-4 mr-2" />
                Bookmarks
              </TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-history">
                <History className="h-4 w-4 mr-2" />
                Reading History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookmarks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookMarked className="h-5 w-5" />
                    Saved Bookmarks
                  </CardTitle>
                  <CardDescription>
                    Quick access to your favorite verses, hadiths, books, and topics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookmarks.length === 0 ? (
                    <div className="text-center py-12">
                      <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">No bookmarks yet</p>
                      <p className="text-sm text-muted-foreground">
                        Bookmark verses, hadiths, books, or topics to save them here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {[...bookmarks]
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .map((bookmark) => {
                          const IconComponent = typeIcons[bookmark.type];
                          return (
                          <div
                            key={bookmark.id}
                            className="flex items-start gap-4 p-4 border rounded-lg hover-elevate"
                            data-testid={`bookmark-${bookmark.id}`}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-1">
                                <Link href={bookmark.url} className="flex-1 min-w-0">
                                  <h4 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                                    {bookmark.title}
                                  </h4>
                                </Link>
                                <Badge variant="outline" className={typeColors[bookmark.type]}>
                                  {bookmark.type}
                                </Badge>
                              </div>
                              {bookmark.subtitle && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {bookmark.subtitle}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                Saved {new Date(bookmark.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link href={bookmark.url}>
                                <Button variant="ghost" size="icon" data-testid={`visit-${bookmark.id}`}>
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBookmark(bookmark.id)}
                                data-testid={`remove-${bookmark.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Reading History
                      </CardTitle>
                      <CardDescription>
                        Recently viewed content across the portal
                      </CardDescription>
                    </div>
                    {history.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearHistory}
                        data-testid="button-clear-history"
                      >
                        Clear History
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">No reading history</p>
                      <p className="text-sm text-muted-foreground">
                        Your recently viewed pages will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[...history]
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, 20)
                        .map((item) => {
                          const IconComponent = typeIcons[item.type];
                          return (
                          <Link
                            key={item.id}
                            href={item.url}
                            className="block"
                            data-testid={`history-${item.id}`}
                          >
                            <div className="flex items-center gap-3 p-3 border rounded-lg hover-elevate">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                                <IconComponent className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium hover:text-primary transition-colors line-clamp-1">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(item.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <Badge variant="outline" className={typeColors[item.type]}>
                                {item.type}
                              </Badge>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Bookmarks are saved locally in your browser</p>
              <p>• Use the bookmark button on Quran verses, Hadiths, and Topics to save them</p>
              <p>• Your reading history is automatically tracked as you browse</p>
              <p>• All data is private and stored only on your device</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
