import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface Topic {
  id: string;
  name: string;
  nameArabic: string;
  section: string;
  summary: string;
  slug: string;
}

export default function PoliticsSection() {
  const { data: topics, isLoading } = useQuery<Topic[]>({
    queryKey: ["/api/sections/politics/topics"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background py-12 md:py-20 border-b">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-3 bg-blue-500/10 px-4 py-2 rounded-full">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">Politics & Governance</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold">
                Islamic Leadership & Justice
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore the Islamic principles of governance, consultation (Shura), justice, and accountability 
                that form the foundation of ethical leadership in Islam.
              </p>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="container py-12 md:py-16 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                Explore Topics
              </h2>
              <p className="text-muted-foreground">
                Each topic includes evidence from Quran, authentic Hadith, and scholarly books
              </p>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics?.map((topic) => (
                  <Link key={topic.id} href={`/topics/${topic.slug}`} data-testid={`link-topic-${topic.slug}`}>
                    <Card className="h-full hover-elevate active-elevate-2 cursor-pointer group" data-testid={`card-topic-${topic.slug}`}>
                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-2">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {topic.name}
                            </CardTitle>
                            <p className="font-arabic text-xl text-primary" dir="rtl">
                              {topic.nameArabic}
                            </p>
                          </div>
                          <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-sm leading-relaxed">
                          {topic.summary}
                        </CardDescription>
                        <div className="flex items-center gap-2 text-sm text-primary font-medium">
                          <span>Explore topic</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && topics?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No topics available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Sections */}
        <div className="bg-muted/30 py-12 md:py-16 border-t">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-xl md:text-2xl font-serif font-bold mb-6">
                Explore Other Sections
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/finance" data-testid="link-section-finance">
                  <Card className="hover-elevate cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-base">Islamic Finance</CardTitle>
                      <CardDescription className="text-sm">
                        Halal economics and business principles
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href="/daily-life" data-testid="link-section-daily-life">
                  <Card className="hover-elevate cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-base">Daily Life & Habits</CardTitle>
                      <CardDescription className="text-sm">
                        Islamic practices for everyday living
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
                <Link href="/medicine" data-testid="link-section-medicine">
                  <Card className="hover-elevate cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-base">Prophetic Medicine</CardTitle>
                      <CardDescription className="text-sm">
                        Healing practices from the Sunnah
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
