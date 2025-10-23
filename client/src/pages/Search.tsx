import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Book, BookOpen, Bookmark, Sparkles, X } from "lucide-react";
import type { Ayah, Hadith, Book as BookType, Topic, Dua } from "@shared/schema";

interface SearchResults {
  quran: Ayah[];
  hadith: Hadith[];
  books: BookType[];
  topics: Topic[];
  duas: Dua[];
}

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: results, isLoading } = useQuery<SearchResults>({
    queryKey: ["/api/search", debouncedQuery, selectedFilter],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        return { quran: [], hadith: [], books: [], topics: [], duas: [] };
      }
      
      const params = new URLSearchParams({ q: debouncedQuery });
      if (selectedFilter !== "all") {
        params.append("type", selectedFilter);
      }
      
      const res = await fetch(`/api/search?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Search failed");
      return await res.json();
    },
    enabled: debouncedQuery.length >= 2,
  });

  const totalResults = results 
    ? (results.quran?.length || 0) + 
      (results.hadith?.length || 0) + 
      (results.books?.length || 0) + 
      (results.topics?.length || 0) + 
      (results.duas?.length || 0)
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Search Header */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Islamic Knowledge Search
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search across Quran, Hadith, Islamic books, topics, and duas
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-3xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for verses, hadiths, books, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg"
              data-testid="input-search"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                data-testid="button-clear-search"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full max-w-3xl mx-auto">
              <TabsTrigger value="all" data-testid="tab-all">All ({totalResults})</TabsTrigger>
              <TabsTrigger value="quran" data-testid="tab-quran">Quran ({results?.quran?.length || 0})</TabsTrigger>
              <TabsTrigger value="hadith" data-testid="tab-hadith">Hadith ({results?.hadith?.length || 0})</TabsTrigger>
              <TabsTrigger value="books" data-testid="tab-books">Books ({results?.books?.length || 0})</TabsTrigger>
              <TabsTrigger value="topics" data-testid="tab-topics">Topics ({results?.topics?.length || 0})</TabsTrigger>
              <TabsTrigger value="duas" data-testid="tab-duas">Duas ({results?.duas?.length || 0})</TabsTrigger>
            </TabsList>

            {/* Search Results */}
            <div className="mt-8">
              {!searchQuery || searchQuery.length < 2 ? (
                <div className="text-center py-12">
                  <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground">
                    Enter at least 2 characters to search
                  </p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : totalResults === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No results found for "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Quran Results */}
                  {(selectedFilter === "all" || selectedFilter === "quran") && results?.quran && results.quran.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Quran ({results.quran.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {results.quran.map((ayah) => (
                          <div 
                            key={ayah.id} 
                            className="p-4 border rounded-md hover-elevate cursor-pointer"
                            onClick={() => setLocation(`/quran/${ayah.surahId}`)}
                            data-testid={`result-quran-${ayah.id}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <p className="font-arabic text-xl text-right leading-loose" dir="rtl">
                                  {ayah.textArabic}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {ayah.translationEn}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {ayah.surahId}:{ayah.ayahNumber}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Hadith Results */}
                  {(selectedFilter === "all" || selectedFilter === "hadith") && results?.hadith && results.hadith.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Book className="h-5 w-5" />
                          Hadith ({results.hadith.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {results.hadith.map((h) => (
                          <div 
                            key={h.id} 
                            className="p-4 border rounded-md hover-elevate cursor-pointer"
                            onClick={() => setLocation(`/hadith?id=${h.id}`)}
                            data-testid={`result-hadith-${h.id}`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge>{h.book}</Badge>
                                <Badge variant={h.grade === "Sahih" ? "default" : "secondary"}>
                                  {h.grade}
                                </Badge>
                              </div>
                              <p className="text-sm line-clamp-3">{h.translationEn}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Books Results */}
                  {(selectedFilter === "all" || selectedFilter === "books") && results?.books && results.books.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Books ({results.books.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {results.books.map((book) => (
                          <div 
                            key={book.id} 
                            className="p-4 border rounded-md hover-elevate cursor-pointer"
                            onClick={() => setLocation(`/books?id=${book.id}`)}
                            data-testid={`result-book-${book.id}`}
                          >
                            <div className="space-y-2">
                              <h4 className="font-semibold">{book.title}</h4>
                              <p className="text-sm text-muted-foreground">{book.author}</p>
                              <p className="text-sm line-clamp-2">{book.description}</p>
                              <Badge variant="outline">{book.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Topics Results */}
                  {(selectedFilter === "all" || selectedFilter === "topics") && results?.topics && results.topics.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Bookmark className="h-5 w-5" />
                          Topics ({results.topics.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {results.topics.map((topic) => (
                          <div 
                            key={topic.id} 
                            className="p-4 border rounded-md hover-elevate cursor-pointer"
                            onClick={() => setLocation(`/topics/${topic.slug}`)}
                            data-testid={`result-topic-${topic.id}`}
                          >
                            <div className="space-y-2">
                              <h4 className="font-semibold">{topic.name}</h4>
                              <p className="text-sm line-clamp-2">{topic.summary}</p>
                              <Badge variant="outline">{topic.section}</Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Duas Results */}
                  {(selectedFilter === "all" || selectedFilter === "duas") && results?.duas && results.duas.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Duas ({results.duas.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {results.duas.map((dua) => (
                          <div 
                            key={dua.id} 
                            className="p-4 border rounded-md hover-elevate cursor-pointer"
                            onClick={() => setLocation(`/duas?category=${dua.category}`)}
                            data-testid={`result-dua-${dua.id}`}
                          >
                            <div className="space-y-2">
                              <p className="font-arabic text-lg text-right" dir="rtl">
                                {dua.textArabic}
                              </p>
                              <p className="text-sm">{dua.translationEn}</p>
                              <Badge variant="outline">{dua.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
