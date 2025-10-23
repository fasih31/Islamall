import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Heart, 
  Moon, 
  Sun, 
  Shield, 
  Sparkles, 
  Calendar,
  BookHeart,
  Plane,
  UtensilsCrossed,
  GraduationCap,
  Info
} from "lucide-react";

interface Dua {
  id: string;
  category: string;
  textArabic: string;
  translationEn: string;
  transliteration?: string;
  reference?: string;
}

interface RecommendedVerse {
  id: number;
  ayahNumber: number;
  textArabic: string;
  translationEn: string;
  surahName: string;
}

interface RecommendedHadith {
  id: number;
  textArabic: string;
  textEnglish: string;
  collection: string;
  bookName: string;
  hadithNumber: string;
}

interface Recommendation {
  scenario: string;
  duas: Dua[];
  verses: RecommendedVerse[];
  hadiths: RecommendedHadith[];
}

const CATEGORIES = [
  { id: "morning", label: "Morning", icon: Sun },
  { id: "evening", label: "Evening", icon: Moon },
  { id: "protection", label: "Protection (Ruqyah)", icon: Shield },
  { id: "healing", label: "Healing (Manzil)", icon: Heart },
  { id: "daily", label: "Daily Adhkar", icon: Calendar },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "food", label: "Food & Drink", icon: UtensilsCrossed },
  { id: "gratitude", label: "Gratitude", icon: Heart },
  { id: "knowledge", label: "Seeking Knowledge", icon: GraduationCap },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "occasions", label: "Special Occasions", icon: Sparkles },
  { id: "forgiveness", label: "Forgiveness", icon: Heart },
  { id: "prayer", label: "Prayer", icon: BookHeart },
];

const SCENARIOS = [
  { id: "stress", label: "Feeling Stressed", description: "Duas for peace and tranquility" },
  { id: "sick", label: "Illness/Health Issues", description: "Healing duas and comfort" },
  { id: "anxious", label: "Anxiety/Worry", description: "Duas for relief from anxiety" },
  { id: "grateful", label: "Thankful", description: "Duas of gratitude and praise" },
  { id: "difficulty", label: "Facing Hardship", description: "Duas for patience and relief" },
  { id: "seeking_guidance", label: "Seeking Guidance", description: "Istikhara and guidance" },
];

export default function DuaPage() {
  const [selectedCategory, setSelectedCategory] = useState("morning");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(() => {
    // Check localStorage for saved consent on mount
    const saved = localStorage.getItem('duaRecommendationsConsent');
    return saved === 'true';
  });

  // Save consent to localStorage when it changes
  const handleConsentChange = (checked: boolean) => {
    setConsentGiven(checked);
    localStorage.setItem('duaRecommendationsConsent', checked.toString());
  };

  const { data: duas, isLoading } = useQuery<Dua[]>({
    queryKey: ["/api/duas", selectedCategory],
    queryFn: async () => {
      const res = await fetch(`/api/duas?category=${selectedCategory}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch duas");
      return await res.json();
    },
  });

  const { data: recommendation } = useQuery<Recommendation>({
    queryKey: ["/api/recommendations/scenario", selectedScenario],
    queryFn: async () => {
      const res = await fetch(`/api/recommendations/scenario?scenario=${selectedScenario}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return await res.json();
    },
    enabled: !!selectedScenario && consentGiven,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Islamic Duas & Supplications
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Authentic supplications from the Quran and Sunnah for every moment of life
            </p>
          </div>

          {/* Smart Recommendations */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <div className="flex-1">
                  <CardTitle>Personalized Recommendations</CardTitle>
                  <CardDescription>Get duas based on your current situation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  We can provide personalized Islamic content recommendations based on your situation. 
                  This feature uses your selections only - no browsing history is accessed.
                </AlertDescription>
              </Alert>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentGiven}
                  onChange={(e) => handleConsentChange(e.target.checked)}
                  className="h-4 w-4"
                  data-testid="checkbox-recommendations-consent"
                />
                <label htmlFor="consent" className="text-sm">
                  I consent to receive personalized recommendations
                </label>
              </div>

              {consentGiven && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SCENARIOS.map(scenario => (
                    <Button
                      key={scenario.id}
                      variant={selectedScenario === scenario.id ? "default" : "outline"}
                      onClick={() => setSelectedScenario(scenario.id)}
                      className="h-auto py-3 px-4 flex flex-col items-start gap-1"
                      data-testid={`button-scenario-${scenario.id}`}
                    >
                      <span className="font-medium">{scenario.label}</span>
                      <span className="text-xs opacity-80">{scenario.description}</span>
                    </Button>
                  ))}
                </div>
              )}

              {recommendation && consentGiven && (
                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Recommended for: {SCENARIOS.find(s => s.id === selectedScenario)?.label}</h3>
                    <div className="space-y-4">
                      {recommendation.duas && recommendation.duas.length > 0 ? (
                        recommendation.duas.map((dua, i) => (
                          <div key={i} className="p-4 bg-background rounded-md border">
                            <p className="font-arabic text-xl text-right mb-3 leading-loose" dir="rtl">{dua.textArabic}</p>
                            <p className="text-sm">{dua.translationEn}</p>
                            {dua.reference && (
                              <Badge variant="outline" className="mt-2">{dua.reference}</Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">Loading recommendations...</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-5 md:grid-cols-10 gap-2 h-auto p-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="flex flex-col items-center gap-1 p-2"
                    data-testid={`tab-${cat.id}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs hidden md:inline">{cat.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading duas...</p>
                </div>
              ) : duas && duas.length > 0 ? (
                <div className="space-y-6">
                  {duas.map((dua) => (
                    <Card key={dua.id} data-testid={`card-dua-${dua.id}`}>
                      <CardContent className="pt-6 space-y-4">
                        <p className="font-arabic text-2xl text-right leading-loose" dir="rtl">
                          {dua.textArabic}
                        </p>
                        {dua.transliteration && (
                          <p className="text-sm text-muted-foreground italic">
                            {dua.transliteration}
                          </p>
                        )}
                        <p className="text-base leading-relaxed">
                          {dua.translationEn}
                        </p>
                        {dua.reference && (
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Badge variant="outline">{dua.reference}</Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No duas found in this category. Content coming soon.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
