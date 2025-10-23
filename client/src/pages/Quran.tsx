import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Volume2, Search, BookOpen } from "lucide-react";
import { Link } from "wouter";

interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  revelationPlace: string;
  totalAyahs: number;
}

export default function Quran() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: surahs, isLoading } = useQuery<Surah[]>({
    queryKey: ["/api/quran/surahs"],
  });

  const filteredSurahs = surahs?.filter(
    (surah) =>
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.nameArabic.includes(searchQuery)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 md:py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-3 md:space-y-4">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
              The Holy Quran
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Read, listen, and explore the divine words of Allah. Complete with
              Arabic text, translations, and audio recitations.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search surahs by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-surah"
            />
          </div>

          {/* Surahs Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSurahs?.map((surah) => (
                <Link
                  key={surah.id}
                  href={`/quran/${surah.id}`}
                  data-testid={`link-surah-${surah.id}`}
                >
                  <Card className="hover-elevate active-elevate-2 cursor-pointer h-full">
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-1">
                            {surah.id}. {surah.name}
                          </CardTitle>
                          <p className="font-arabic text-2xl mt-1 text-primary">
                            {surah.nameArabic}
                          </p>
                        </div>
                        <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                      <CardDescription className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {surah.revelationPlace}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {surah.totalAyahs} Ayahs
                        </span>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {filteredSurahs?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No surahs found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
