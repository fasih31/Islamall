import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, ExternalLink, BookMarked, DollarSign, Building2, Sun, HeartPulse, Globe, BookText, Sparkles } from "lucide-react";

interface Book {
  id: string;
  title: string;
  titleArabic?: string;
  author: string;
  authorArabic?: string;
  category: string;
  description: string;
  language: string;
  coverImageUrl?: string;
  pdfUrl?: string;
  purchaseUrl?: string;
  isFeatured: boolean;
}

const CATEGORIES = [
  { value: "all", label: "All Books", Icon: BookOpen },
  { value: "finance", label: "Finance & Economics", Icon: DollarSign },
  { value: "politics", label: "Politics & Governance", Icon: Building2 },
  { value: "daily_life", label: "Daily Life & Habits", Icon: Sun },
  { value: "medicine", label: "Islamic Medicine", Icon: HeartPulse },
  { value: "culture", label: "Culture & History", Icon: Globe },
  { value: "reference", label: "Reference Works", Icon: BookText },
];

export default function Books() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: allBooks, isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const { data: searchResults } = useQuery<Book[]>({
    queryKey: [`/api/books/search?q=${encodeURIComponent(searchQuery)}`],
    enabled: searchQuery.length > 2,
  });

  const filteredBooks = searchQuery.length > 2
    ? searchResults
    : selectedCategory === "all"
    ? allBooks
    : allBooks?.filter(book => book.category === selectedCategory);

  const featuredBooks = allBooks?.filter(book => book.isFeatured).slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-7xl mx-auto space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              Islamic Library
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Authentic Islamic books covering finance, politics, daily life, medicine, culture, and more
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books by title, author, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-books"
              />
            </div>
          </div>

          {/* Featured Books */}
          {!searchQuery && featuredBooks && featuredBooks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Featured Books</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredBooks.map((book) => (
                  <Card key={book.id} className="hover-elevate" data-testid={`card-featured-book-${book.id}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      {book.titleArabic && (
                        <p className="font-arabic text-lg text-primary" dir="rtl">
                          {book.titleArabic}
                        </p>
                      )}
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {book.description}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary">{book.language}</Badge>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            data-testid={`button-detail-${book.id}`}
                          >
                            <Link href={`/books/${book.id}`}>
                              <BookOpen className="h-3 w-3 mr-1" />
                              Details
                            </Link>
                          </Button>
                          {book.purchaseUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              data-testid={`button-view-${book.id}`}
                            >
                              <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
            <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full h-auto gap-2 bg-transparent p-0">
              {CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="flex flex-col items-center gap-1 data-[state=active]:bg-primary/10"
                  data-testid={`tab-${category.value}`}
                >
                  <category.Icon className="h-4 w-4" />
                  <span className="text-xs hidden md:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map((category) => (
              <TabsContent key={category.value} value={category.value} className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks && filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <Card key={book.id} className="hover-elevate" data-testid={`card-book-${book.id}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2">
                              <CardTitle className="text-base">{book.title}</CardTitle>
                              {book.titleArabic && (
                                <p className="font-arabic text-base text-primary" dir="rtl">
                                  {book.titleArabic}
                                </p>
                              )}
                              <CardDescription className="text-sm">
                                {book.author}
                                {book.authorArabic && (
                                  <span className="font-arabic mr-2" dir="rtl">
                                    ({book.authorArabic})
                                  </span>
                                )}
                              </CardDescription>
                            </div>
                            <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-4">
                            {book.description}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="outline">{book.language}</Badge>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                data-testid={`button-detail-${book.id}`}
                              >
                                <Link href={`/books/${book.id}`}>
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  Details
                                </Link>
                              </Button>
                              {book.purchaseUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  data-testid={`button-purchase-${book.id}`}
                                >
                                  <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Get Book
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">No books found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
