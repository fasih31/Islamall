import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IslamicChatbot } from "@/components/IslamicChatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookText, Volume2, Languages } from "lucide-react";

interface Hadith {
  id: string;
  book: string;
  chapter: string;
  textArabic: string;
  translationEn: string;
  narrator: string;
  grade: string;
  sourceUrl?: string;
}

interface HadithTranslation {
  id: string;
  hadithId: string;
  language: string;
  text: string;
  translatorName?: string;
}

const COLLECTIONS = [
  { value: "all", label: "All Collections" },
  { value: "صحيح البخاري", label: "Sahih Bukhari" },
  { value: "صحيح مسلم", label: "Sahih Muslim" },
  { value: "سنن أبي داود", label: "Sunan Abu Dawud" },
  { value: "جامع الترمذي", label: "Jami' al-Tirmidhi" },
  { value: "سنن النسائي", label: "Sunan al-Nasai" },
  { value: "سنن ابن ماجه", label: "Sunan Ibn Majah" },
];

const GRADES = [
  { value: "all", label: "All Grades" },
  { value: "Sahih", label: "Sahih (Authentic)" },
  { value: "Hasan", label: "Hasan (Good)" },
];

interface HadithResponse {
  hadith: Hadith[];
  total: number;
}

export default function HadithPage() {
  const [view, setView] = useState<"books" | "hadiths">("books");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const { data: hadithData, isLoading } = useQuery<HadithResponse>({
    queryKey: ["/api/hadith", page, pageSize],
    queryFn: async () => {
      const offset = (page - 1) * pageSize;
      const res = await fetch(`/api/hadith?limit=${pageSize}&offset=${offset}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return await res.json();
    },
  });
  
  const hadithList = hadithData?.hadith;

  const { data: searchResults, isLoading: searchLoading } = useQuery<Hadith[]>({
    queryKey: ["/api/hadith/search", searchQuery, selectedCollection, selectedGrade],
    queryFn: async () => {
      const params = new URLSearchParams({ q: searchQuery });
      if (selectedCollection !== "all") params.append("book", selectedCollection);
      if (selectedGrade !== "all") params.append("grade", selectedGrade);
      const res = await fetch(`/api/hadith/search?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return await res.json();
    },
    enabled: searchQuery.length > 2,
  });

  const { data: translations } = useQuery<HadithTranslation[]>({
    queryKey: ["/api/hadith/translations", selectedLanguage],
    enabled: selectedLanguage !== "en",
  });

  // Apply filters to hadith list
  let displayedHadith = searchQuery.length > 2 ? searchResults : hadithList;
  
  if (searchQuery.length <= 2 && displayedHadith) {
    if (selectedCollection !== "all") {
      displayedHadith = displayedHadith.filter(h => h.book === selectedCollection);
    }
    if (selectedGrade !== "all") {
      displayedHadith = displayedHadith.filter(h => h.grade === selectedGrade);
    }
  }

  const getTranslation = (hadithId: string): string => {
    if (selectedLanguage === "en") {
      const hadith = displayedHadith?.find(h => h.id === hadithId);
      return hadith?.translationEn || "";
    }
    const translation = translations?.find(t => t.hadithId === hadithId);
    return translation?.text || displayedHadith?.find(h => h.id === hadithId)?.translationEn || "";
  };

  const getGradeColor = (grade: string) => {
    if (grade === "Sahih") return "bg-green-500/10 text-green-700 dark:text-green-400";
    if (grade === "Hasan") return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
  };

  const handleSelectBook = (bookValue: string) => {
    setSelectedBook(bookValue);
    setSelectedCollection(bookValue);
    setView("hadiths");
    setPage(1);
  };

  const handleBackToBooks = () => {
    setView("books");
    setSelectedBook("");
    setSelectedCollection("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              {view === "books" ? "Hadith Collections" : selectedBook}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {view === "books" 
                ? "Choose from authentic collections of Prophet Muhammad's ﷺ sayings and teachings"
                : "Explore authentic hadiths from this collection"}
            </p>
          </div>

          {/* Books View */}
          {view === "books" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COLLECTIONS.filter(c => c.value !== "all").map((collection) => (
                <Card 
                  key={collection.value}
                  className="hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => handleSelectBook(collection.value)}
                  data-testid={`card-book-${collection.value}`}
                >
                  <CardHeader>
                    <BookText className="h-12 w-12 mb-4 text-primary" />
                    <CardTitle className="text-xl">{collection.label}</CardTitle>
                    <CardDescription className="font-arabic text-lg" dir="rtl">
                      {collection.value}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" data-testid={`button-view-${collection.value}`}>
                      View Collection
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Controls: Search and Filters - Only show in hadiths view */}
          {view === "hadiths" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToBooks}
                  data-testid="button-back-to-books"
                >
                  ← Back to Collections
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="relative md:col-span-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search hadith by text or topic..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-hadith"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger data-testid="select-hadith-grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map(grade => (
                      <SelectItem key={grade.value} value={grade.value}>{grade.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger data-testid="select-hadith-translation-language">
                    <SelectValue placeholder="Translation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ur">اردو (Urdu)</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedGrade("all");
                    setSearchQuery("");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Hadith List - Only show in hadiths view */}
          {view === "hadiths" && (
            <>
              {isLoading || searchLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {displayedHadith?.map((hadith) => (
                      <Card key={hadith.id} data-testid={`card-hadith-${hadith.id}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg">
                                {hadith.book}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                Narrated by {hadith.narrator}
                              </CardDescription>
                            </div>
                            <Badge className={getGradeColor(hadith.grade)}>
                              {hadith.grade}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p
                            className="font-arabic text-2xl leading-loose text-right"
                            dir="rtl"
                          >
                            {hadith.textArabic}
                          </p>
                          <p 
                            className="text-muted-foreground leading-relaxed"
                            dir={selectedLanguage === "ur" || selectedLanguage === "ar" ? "rtl" : "ltr"}
                          >
                            {getTranslation(hadith.id)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {displayedHadith?.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No hadith found matching your search.
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {!searchQuery && hadithData && hadithData.total > pageSize && (
                    <div className="flex items-center justify-center gap-4 pt-8">
                      <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        data-testid="button-prev-page"
                      >
                        Previous
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Page {page} of {Math.ceil(hadithData.total / pageSize)} 
                        <span className="ml-2">({hadithData.total.toLocaleString()} total hadiths)</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= Math.ceil(hadithData.total / pageSize)}
                        data-testid="button-next-page"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <IslamicChatbot type="hadith" />
    </div>
  );
}
