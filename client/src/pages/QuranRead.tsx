import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Languages, Volume2, Book } from "lucide-react";

interface Ayah {
  id: string;
  surahId: number;
  ayahNumber: number;
  textArabic: string;
  translationEn: string;
  audioUrl?: string;
}

interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  revelationPlace: string;
  totalAyahs: number;
}

interface Translation {
  id: string;
  ayahId: string;
  language: string;
  text: string;
  translatorName?: string;
}

interface Reciter {
  id: string;
  name: string;
  nameArabic: string;
  identifier: string;
}

const TRANSLATORS = [
  { value: "sahih_int", name: "Sahih International", language: "en" },
  { value: "pickthall", name: "Mohammed Marmaduke Pickthall", language: "en" },
  { value: "yusuf_ali", name: "Abdullah Yusuf Ali", language: "en" },
  { value: "hilali_khan", name: "Hilali & Khan", language: "en" },
  { value: "asad", name: "Muhammad Asad", language: "en" },
];

const RECITER_AUDIO_MAP: Record<string, string> = {
  "mishary_rashid": "ar.alafasy",
  "abdul_basit": "ar.abdulbasitmurattal",
  "abdulrahman_sudais": "ar.abdurrahmaansudais",
  "saad_al_ghamdi": "ar.saadalghamadi",
  "maher_al_muaiqly": "ar.mahermuaiqly",
};

export default function QuranRead() {
  const [, params] = useRoute("/quran/read/:id");
  const surahId = params?.id ? parseInt(params.id) : null;
  const [selectedTranslator, setSelectedTranslator] = useState<string>("sahih_int");
  const [selectedReciter, setSelectedReciter] = useState<string>("mishary_rashid");
  const [playingAyah, setPlayingAyah] = useState<string | null>(null);

  const { data: surah, isLoading: surahLoading } = useQuery<Surah>({
    queryKey: ["/api/quran/surah", surahId],
    enabled: !!surahId,
  });

  const { data: ayahs, isLoading: ayahsLoading } = useQuery<Ayah[]>({
    queryKey: ["/api/quran/surah", surahId, "ayahs"],
    enabled: !!surahId,
  });

  const currentTranslator = TRANSLATORS.find(t => t.value === selectedTranslator);
  
  const { data: reciters } = useQuery<Reciter[]>({
    queryKey: ["/api/reciters"],
  });
  
  const { data: translations } = useQuery<Translation[]>({
    queryKey: ["/api/quran/translations", surahId, currentTranslator?.language, currentTranslator?.name],
    enabled: !!surahId && !!currentTranslator,
  });

  const handlePlayAudio = async (ayah: Ayah) => {
    try {
      setPlayingAyah(ayah.id);
      
      // Extract global verse number from existing audio URL and replace reciter
      let audioUrl = ayah.audioUrl;
      
      if (!audioUrl) {
        console.error("No audio URL available for this ayah");
        setPlayingAyah(null);
        return;
      }
      
      if (selectedReciter !== "mishary_rashid") {
        const reciterCode = RECITER_AUDIO_MAP[selectedReciter] || "ar.alafasy";
        // Replace the reciter code in the URL (e.g., ar.alafasy -> ar.abdulbasitmurattal)
        audioUrl = audioUrl.replace(/ar\.[a-z]+/, reciterCode);
      }
      
      console.log("Playing audio from:", audioUrl);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setPlayingAyah(null);
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setPlayingAyah(null);
      };
      
      await audio.play();
    } catch (error) {
      console.error("Failed to play audio:", error);
      setPlayingAyah(null);
    }
  };

  const getTranslation = (ayahId: string): string => {
    if (!currentTranslator) return "";
    const translation = translations?.find(t => 
      t.ayahId === ayahId && t.translatorName === currentTranslator.name
    );
    return translation?.text || ayahs?.find(a => a.id === ayahId)?.translationEn || "";
  };

  if (surahLoading || ayahsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!surah || !ayahs) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Surah not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background islamic-pattern-bg">
      <Header />

      <main className="flex-1">
        {/* Sticky Controls */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b shadow-sm">
          <div className="container py-3 md:py-4">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                data-testid="button-back"
                className="flex-shrink-0"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>

              <div className="flex-1 text-center hidden md:block">
                <h2 className="font-serif text-lg font-bold">{surah.name}</h2>
                <p className="text-xs text-muted-foreground">{surah.totalAyahs} Ayahs • {surah.revelationPlace}</p>
              </div>

              <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                <Select value={selectedTranslator} onValueChange={setSelectedTranslator}>
                  <SelectTrigger className="h-8 w-[160px] md:w-[180px]" data-testid="select-translator">
                    <Languages className="h-3 w-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSLATORS.map(translator => (
                      <SelectItem key={translator.value} value={translator.value}>
                        {translator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                  <SelectTrigger className="h-8 w-[160px] md:w-[180px]" data-testid="select-reciter">
                    <Volume2 className="h-3 w-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reciters?.map(reciter => (
                      <SelectItem key={reciter.id} value={reciter.identifier}>
                        {reciter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Content */}
        <div className="container py-6 md:py-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Bismillah */}
            {surahId !== 1 && surahId !== 9 && (
              <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
                <p className="font-arabic text-3xl md:text-4xl text-primary arabic-enhanced" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}

            {/* Continuous Reading */}
            <div className="space-y-6 md:space-y-8">
              {ayahs.map((ayah, index) => (
                <div 
                  key={ayah.id} 
                  className="group bg-card/50 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-card-border hover:border-primary/30 transition-all duration-300 card-elevate animate-fade-in-up" 
                  data-testid={`ayah-${ayah.ayahNumber}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <Badge 
                      variant="outline" 
                      className="flex-shrink-0 mt-1 h-7 w-7 md:h-8 md:w-8 flex items-center justify-center text-xs font-semibold glow-primary-hover"
                    >
                      {ayah.ayahNumber}
                    </Badge>
                    
                    <div className="flex-1 space-y-3 md:space-y-4">
                      {/* Arabic Text */}
                      <p 
                        className="font-arabic text-xl md:text-2xl lg:text-3xl leading-loose md:leading-loose text-right cursor-pointer hover:text-primary transition-colors arabic-enhanced" 
                        dir="rtl"
                        onClick={() => handlePlayAudio(ayah)}
                      >
                        {ayah.textArabic}
                      </p>
                      
                      {/* Translation */}
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {getTranslation(ayah.id)}
                      </p>

                      {/* Audio Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePlayAudio(ayah)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-7"
                        data-testid={`button-play-${ayah.ayahNumber}`}
                      >
                        <Volume2 className={`h-3 w-3 mr-1 ${playingAyah === ayah.id ? 'text-primary' : ''}`} />
                        <span className="text-xs">
                          {playingAyah === ayah.id ? 'Playing...' : 'Listen'}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
