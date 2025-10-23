import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { QuickAccessCard } from "@/components/QuickAccessCard";
import { VerseCard } from "@/components/VerseCard";
import { HadithCard } from "@/components/HadithCard";
import { PrayerTimeCard } from "@/components/PrayerTimeCard";
import { EventCard } from "@/components/EventCard";
import { StatCard } from "@/components/StatCard";
import { Footer } from "@/components/Footer";
import { BookOpen, FileText, Clock, DollarSign, Users } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RandomAyah {
  id: string;
  surahId: number;
  ayahNumber: number;
  textArabic: string;
  translationEn: string;
  surahName: string;
  surahNameArabic: string;
}

interface RandomHadith {
  id: string;
  book: string;
  chapter: string;
  textArabic: string;
  translationEn: string;
  narrator: string;
  grade: string;
}

interface Dua {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  textArabic: string;
  translationEn: string;
  category: string;
  benefits?: string;
}

interface Book {
  id: string;
  title: string;
  titleArabic?: string;
  author: string;
  category: string;
  description: string;
  language: string;
  coverImageUrl?: string;
  pdfUrl?: string;
  isFeatured: boolean;
}

interface CultureArticle {
  id: string;
  title: string;
  titleArabic?: string;
  category: string;
  excerpt: string;
  imageUrl?: string;
  featured: boolean;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  description?: string;
  attendees: number;
  verified: boolean;
}

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: verseOfDay, isLoading: verseLoading } = useQuery<RandomAyah>({
    queryKey: ["/api/ayahs/random"],
  });

  const { data: hadithOfDay, isLoading: hadithLoading } = useQuery<RandomHadith>({
    queryKey: ["/api/hadith/random"],
  });

  const { data: featuredDuas } = useQuery<Dua[]>({
    queryKey: ["/api/duas/featured"],
  });

  const { data: featuredBooks } = useQuery<Book[]>({
    queryKey: ["/api/books/featured"],
  });

  const { data: cultureArticles } = useQuery<CultureArticle[]>({
    queryKey: ["/api/culture/articles?featured=true"],
  });

  const { data: upcomingEvents } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Hero />

      <main className="flex-1 container py-12 md:py-16 space-y-16 animate-fade-in-up">
        {/* Quick Access Section */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-center mb-8">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAccessCard
              title="Quran"
              description="Read and explore the Holy Quran"
              icon={BookOpen}
              onClick={() => setLocation("/quran")}
            />
            <QuickAccessCard
              title="Hadith"
              description="Browse authentic Hadith collections"
              icon={FileText}
              onClick={() => setLocation("/hadith")}
            />
            <QuickAccessCard
              title="Prayer Times"
              description="Track daily prayer schedules"
              icon={Clock}
              onClick={() => setLocation("/prayer-times")}
            />
            <QuickAccessCard
              title="Finance"
              description="Islamic finance guidance & tools"
              icon={DollarSign}
              onClick={() => setLocation("/finance")}
            />
          </div>
        </section>

        {/* Prayer Times Section */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-center mb-8">Today's Prayer Times</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <PrayerTimeCard name="Fajr" time="05:30" isNext={true} />
            <PrayerTimeCard name="Dhuhr" time="12:45" />
            <PrayerTimeCard name="Asr" time="16:15" />
            <PrayerTimeCard name="Maghrib" time="18:30" />
            <PrayerTimeCard name="Isha" time="20:00" />
          </div>
        </section>

        {/* Featured Content Section */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-center mb-8">Featured Content</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-semibold text-xl">Verse of the Day</h3>
              {verseLoading ? (
                <Skeleton className="h-48" />
              ) : verseOfDay ? (
                <VerseCard
                  surahName={verseOfDay.surahName}
                  verseNumber={verseOfDay.ayahNumber}
                  arabicText={verseOfDay.textArabic}
                  translation={verseOfDay.translationEn}
                />
              ) : (
                <div className="p-6 bg-card rounded-lg text-center text-muted-foreground">
                  Unable to load verse
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold text-xl">Hadith of the Day</h3>
              {hadithLoading ? (
                <Skeleton className="h-48" />
              ) : hadithOfDay ? (
                <HadithCard
                  book={hadithOfDay.book}
                  chapter={hadithOfDay.chapter}
                  arabicText={hadithOfDay.textArabic}
                  translation={hadithOfDay.translationEn}
                  grade={hadithOfDay.grade}
                  narrator={hadithOfDay.narrator}
                />
              ) : (
                <div className="p-6 bg-card rounded-lg text-center text-muted-foreground">
                  Unable to load hadith
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-card rounded-xl p-12">
          <h2 className="font-serif text-3xl font-bold text-center mb-8">Our Islamic Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Quranic Verses" value="6,236" icon={BookOpen} />
            <StatCard label="Authentic Hadith" value="34,532" icon={FileText} />
            <StatCard label="Community Members" value="150K+" icon={Users} />
          </div>
        </section>

        {/* Featured Duas Section */}
        {featuredDuas && featuredDuas.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl font-bold">Featured Duas</h2>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/duas")}
                data-testid="button-view-all-duas"
              >
                View All Duas
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDuas.slice(0, 3).map((dua) => (
                <Card key={dua.id} data-testid={`card-dua-${dua.id}`} className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-lg">{dua.titleEnglish}</CardTitle>
                    <CardDescription className="font-arabic text-xl" dir="rtl">
                      {dua.titleArabic}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-arabic text-2xl leading-loose text-right" dir="rtl">
                      {dua.textArabic}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {dua.translationEn}
                    </p>
                    {dua.benefits && (
                      <div className="pt-2 border-t">
                        <p className="text-sm font-semibold mb-1">Benefits:</p>
                        <p className="text-sm text-muted-foreground">{dua.benefits}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Featured Books Section */}
        {featuredBooks && featuredBooks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl font-bold">Featured Books</h2>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/books")}
                data-testid="button-view-all-books"
              >
                View All Books
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBooks.slice(0, 3).map((book) => (
                <Card key={book.id} className="hover-elevate" data-testid={`card-book-${book.id}`}>
                  {book.coverImageUrl && (
                    <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                      <img
                        src={book.coverImageUrl}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{book.title}</CardTitle>
                    {book.titleArabic && (
                      <p className="font-arabic text-lg text-muted-foreground" dir="rtl">
                        {book.titleArabic}
                      </p>
                    )}
                    <CardDescription>By {book.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {book.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Culture & Brotherhood Section */}
        {cultureArticles && cultureArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl font-bold">Culture & Brotherhood</h2>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/culture")}
                data-testid="button-view-all-culture"
              >
                View All Articles
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cultureArticles.slice(0, 3).map((article) => (
                <Card key={article.id} className="overflow-hidden hover-elevate" data-testid={`card-culture-${article.id}`}>
                  {article.imageUrl && (
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    {article.titleArabic && (
                      <p className="font-arabic text-lg text-muted-foreground" dir="rtl">
                        {article.titleArabic}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Events Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold">Upcoming Events</h2>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/community")}
              data-testid="button-view-all-events"
            >
              View All Events
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents && upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 3).map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  date={new Date(event.date).toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                  location={event.location}
                  organizer={event.organizer}
                  attendees={event.attendees}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No upcoming events at this time.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}