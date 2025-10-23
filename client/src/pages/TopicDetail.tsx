import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, BookMarked, MessageSquare, ChevronLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";
import type { Topic, EnrichedTopicContent } from "@shared/schema";

interface TopicData {
  topic: Topic;
  content: EnrichedTopicContent[];
}

export default function TopicDetail() {
  const [, params] = useRoute("/topics/:slug");
  const slug = params?.slug;

  const { data, isLoading } = useQuery<TopicData>({
    queryKey: [`/api/topics/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data?.topic) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Topic not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { topic, content } = data;
  
  // Group content by type
  const quranContent = content?.filter(c => c.contentType === 'quran') || [];
  const hadithContent = content?.filter(c => c.contentType === 'hadith') || [];
  const bookContent = content?.filter(c => c.contentType === 'book') || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 md:py-16 border-b">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="mb-6"
                data-testid="button-back"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <div className="space-y-6">
                <div>
                  <Badge variant="outline" className="mb-4">
                    {topic.section.replace('_', ' ')}
                  </Badge>
                  <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">
                    {topic.name}
                  </h1>
                  <p className="font-arabic text-3xl md:text-4xl text-primary" dir="rtl">
                    {topic.nameArabic}
                  </p>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {topic.summary}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="container py-12 md:py-16 px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Quran Evidence Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-serif font-bold">
                  Quranic Evidence
                </h2>
              </div>
              {quranContent.length > 0 ? (
                <div className="space-y-4">
                  {quranContent.map((item, index) => (
                    <Card key={index}>
                      {item.details ? (
                        <>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              Surah {item.details.surah?.name} ({item.details.surah?.nameArabic}) - Ayah {item.details.ayahNumber}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="font-arabic text-2xl text-right leading-loose" dir="rtl">
                              {item.details.textArabic}
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                              {item.details.translationEn}
                            </p>
                          </CardContent>
                        </>
                      ) : (
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground italic">
                            Content reference not found (ID: {item.referenceId})
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Quranic verses for this topic are being curated...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Hadith References Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-serif font-bold">
                  Hadith References
                </h2>
              </div>
              {hadithContent.length > 0 ? (
                <div className="space-y-4">
                  {hadithContent.map((item, index) => (
                    <Card key={index}>
                      {item.details ? (
                        <>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">
                                {item.details.book} - {item.details.chapter}
                              </CardTitle>
                              {item.details.grade && (
                                <Badge variant={item.details.grade === 'Sahih' ? 'default' : 'secondary'}>
                                  {item.details.grade}
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {item.details.textArabic && (
                              <p className="font-arabic text-xl text-right leading-loose" dir="rtl">
                                {item.details.textArabic}
                              </p>
                            )}
                            <p className="text-muted-foreground leading-relaxed">
                              {item.details.translationEn}
                            </p>
                            {item.details.narrator && (
                              <p className="text-sm text-muted-foreground">
                                Narrator: {item.details.narrator}
                              </p>
                            )}
                          </CardContent>
                        </>
                      ) : (
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground italic">
                            Content reference not found (ID: {item.referenceId})
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Authentic Hadith references are being curated...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Scholarly Books Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <BookMarked className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-serif font-bold">
                  Scholarly References
                </h2>
              </div>
              {bookContent.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {bookContent.map((item, index) => (
                    <Card key={index} className="hover-elevate">
                      {item.details ? (
                        <>
                          <CardHeader>
                            <CardTitle className="text-lg">{item.details.title}</CardTitle>
                            <CardDescription>{item.details.author}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            {item.details.description && (
                              <p className="text-sm text-muted-foreground mb-4">
                                {item.details.description}
                              </p>
                            )}
                            {item.details.purchaseUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={item.details.purchaseUrl} target="_blank" rel="noopener noreferrer">
                                  View Book
                                </a>
                              </Button>
                            )}
                          </CardContent>
                        </>
                      ) : (
                        <CardContent className="pt-6">
                          <p className="text-sm text-muted-foreground italic">
                            Content reference not found (ID: {item.referenceId})
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Book excerpts and scholarly commentary are being curated...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Explore More */}
            <div className="pt-8 border-t">
              <h3 className="text-xl font-serif font-bold mb-6">
                Explore More Topics
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href={`/${topic.section.replace('_', '-')}`}>
                  <Card className="hover-elevate cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Browse {topic.section.replace('_', ' ')} topics
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Explore more topics in this section
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href="/quran">
                  <Card className="hover-elevate cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-base">Read the Quran</CardTitle>
                      <CardDescription className="text-sm">
                        Explore the complete Quran with translations
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
