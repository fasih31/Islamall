import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
import heroImage from "@assets/stock_images/islamic_geometric_pa_f1702c49.jpg";
import { useQuery } from "@tanstack/react-query";

interface Ayah {
  textArabic: string;
  translationEn: string;
  surahId: number;
  ayahNumber: number;
}

export function Hero() {
  const { data: randomAyah } = useQuery<Ayah>({
    queryKey: ["/api/ayahs/random"],
    refetchInterval: 60000,
  });

  return (
    <section className="relative py-20 md:py-32 overflow-hidden islamic-pattern-bg islamic-overlay">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h1 className="font-serif text-5xl md:text-7xl font-bold gradient-text">
            Islamic Compass
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Your comprehensive guide to authentic Islamic knowledge and practice
          </p>

          {randomAyah && (
            <div className="bg-card/50 backdrop-blur-sm border border-card-border rounded-2xl p-8 space-y-4 card-elevate glow-primary">
              <p className="font-arabic text-2xl md:text-3xl text-primary leading-loose arabic-enhanced" dir="rtl">
                {randomAyah.textArabic}
              </p>
              <div className="islamic-divider">
                <span className="inline-block px-4 bg-background text-primary">﴿ ❁ ﴾</span>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                {randomAyah.translationEn}
              </p>
              <p className="text-xs text-muted-foreground font-semibold">
                Surah {randomAyah.surahId}, Verse {randomAyah.ayahNumber}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/30" data-testid="button-start-reading">
              <BookOpen className="h-5 w-5" />
              Start Reading Quran
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-background/50 backdrop-blur-sm border-2 border-primary/50 hover:bg-primary/10 shadow-md"
              data-testid="button-explore-hadith"
            >
              <Search className="h-5 w-5" />
              Explore Hadith
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}