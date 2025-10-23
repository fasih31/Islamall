import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
import heroImage from "@assets/stock_images/islamic_geometric_pa_f1702c49.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Islamic geometric patterns"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative container flex min-h-[600px] flex-col items-center justify-center gap-8 py-20 text-center">
        <div className="space-y-4 max-w-3xl">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground">
            Your Journey to Islamic Knowledge
          </h1>
          
          <div className="space-y-2">
            <p className="font-arabic text-3xl sm:text-4xl leading-loose text-foreground" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground">
              In the name of Allah, the Most Gracious, the Most Merciful
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="gap-2" data-testid="button-start-reading">
            <BookOpen className="h-5 w-5" />
            Start Reading Quran
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 bg-background/50 backdrop-blur-sm" 
            data-testid="button-explore-hadith"
          >
            <Search className="h-5 w-5" />
            Explore Hadith
          </Button>
        </div>
      </div>
    </section>
  );
}
