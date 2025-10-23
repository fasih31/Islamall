import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Users, Globe, BookOpen, Image, Video } from "lucide-react";

interface CultureArticle {
  id: string;
  title: string;
  titleArabic?: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
}

const categories = [
  { name: "Brotherhood", icon: Users, color: "bg-emerald-500/10 text-emerald-500" },
  { name: "Culture", icon: Globe, color: "bg-blue-500/10 text-blue-500" },
  { name: "Heritage", icon: BookOpen, color: "bg-purple-500/10 text-purple-500" },
];

export default function CultureBrotherhood() {
  const { data: articles, isLoading } = useQuery<CultureArticle[]>({
    queryKey: ["/api/culture/articles"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="font-serif text-4xl md:text-5xl font-bold">
                Culture & Brotherhood
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore the rich cultural heritage of Islam and the bonds of brotherhood that unite Muslims worldwide
            </p>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name} className="hover-elevate" data-testid={`category-${category.name.toLowerCase()}`}>
                  <CardHeader>
                    <div className={`inline-flex p-3 rounded-lg ${category.color} w-fit`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>
                      {category.name === "Brotherhood" && "Stories of unity and compassion in Islam"}
                      {category.name === "Culture" && "Islamic art, architecture, and cultural traditions"}
                      {category.name === "Heritage" && "Preserving and celebrating Islamic history"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Articles Grid */}
          <div>
            <h2 className="font-serif text-3xl font-bold mb-6">Featured Articles</h2>
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <CardHeader>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles?.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover-elevate" data-testid={`article-${article.id}`}>
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
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" data-testid={`badge-${article.category.toLowerCase()}`}>
                          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      {article.titleArabic && (
                        <p className="font-arabic text-lg text-muted-foreground" dir="rtl">
                          {article.titleArabic}
                        </p>
                      )}
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Media Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card data-testid="card-gallery">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  <CardTitle>Photo Gallery</CardTitle>
                </div>
                <CardDescription>
                  Visual journey through Islamic art, architecture, and cultural celebrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coming soon: Browse our curated collection of photographs showcasing Islamic heritage sites, traditional crafts, and community gatherings.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-videos">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <CardTitle>Video Library</CardTitle>
                </div>
                <CardDescription>
                  Documentaries and features on Islamic culture and history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coming soon: Watch documentaries about Islamic civilizations, traditional arts, and inspiring stories of unity and faith.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
