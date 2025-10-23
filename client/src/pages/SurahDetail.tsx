import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IslamicChatbot } from "@/components/IslamicChatbot";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Volume2, ChevronLeft, Bookmark, Languages, Book } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

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
  bio?: string;
}

const TRANSLATORS = [
  { value: "sahih_int", name: "Sahih International", language: "en" },
  { value: "pickthall", name: "Mohammed Marmaduke Pickthall", language: "en" },
  { value: "yusuf_ali", name: "Abdullah Yusuf Ali", language: "en" },
  { value: "hilali_khan", name: "Hilali & Khan", language: "en" },
  { value: "asad", name: "Muhammad Asad", language: "en" },
  { value: "maududi", name: "Abul Ala Maududi", language: "ur" },
  { value: "ahmed_ali", name: "Ahmed Ali", language: "ur" },
  { value: "jalandhry", name: "Fateh Muhammad Jalandhry", language: "ur" },
  { value: "farooq_khan", name: "Muhammad Farooq Khan", language: "hi" },
  { value: "razavi", name: "Imam Ghulam Razavi", language: "hi" },
  { value: "jalalayn", name: "Tafsir al-Jalalayn", language: "ar" },
  { value: "muyassar", name: "Al-Tafsir al-Muyassar", language: "ar" },
];

const RECITER_AUDIO_MAP: Record<string, string> = {
  "mishary_rashid": "ar.alafasy",
  "abdul_basit": "ar.abdulbasitmurattal",
  "abdulrahman_sudais": "ar.abdurrahmaansudais",
  "saad_al_ghamdi": "ar.saadalghamadi",
  "maher_al_muaiqly": "ar.mahermuaiqly",
};

export default function SurahDetail() {
  const [, params] = useRoute("/quran/:id");
  const surahId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [playingAyah, setPlayingAyah] = useState<string | null>(null);
  const [selectedTranslator, setSelectedTranslator] = useState<string>("sahih_int");
  const [selectedReciter, setSelectedReciter] = useState<string>("mishary_rashid");

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
        console.error("No audio URL for ayah:", ayah.id);
        toast({
          title: "Audio Unavailable",
          description: "No audio recitation available for this verse",
          variant: "destructive",
        });
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
      
      audio.onended = () => {
        setPlayingAyah(null);
      };
      
      audio.onerror = (e) => {
        console.error("Audio error:", e);
        setPlayingAyah(null);
        toast({
          title: "Playback Error",
          description: "Failed to play audio. Please try again.",
          variant: "destructive",
        });
      };
      
      await audio.play();
      
      const reciterName = reciters?.find(r => r.identifier === selectedReciter)?.name || "Mishary Rashid Alafasy";
      toast({
        title: "Playing Recitation",
        description: `Authentic recitation by ${reciterName}`,
      });
    } catch (error) {
      console.error("Audio playback error:", error);
      setPlayingAyah(null);
      toast({
        title: "Audio Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      });
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
        <main className="flex-1 container py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-32 w-full" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
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

      <main className="flex-1 container py-6 md:py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in-up">
          {/* Navigation */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              data-testid="button-back"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Surahs
            </Button>
            <Button
              variant="outline"
              asChild
              data-testid="button-reading-mode"
            >
              <a href={`/quran/read/${surahId}`}>
                <Book className="h-4 w-4 mr-2" />
                Reading Mode
              </a>
            </Button>
          </div>

          {/* Surah Header */}
          <Card className="overflow-hidden relative islamic-overlay">
            <CardContent className="pt-6 space-y-6 relative z-10">
              <div className="text-center space-y-4">
                <h1 className="font-serif text-3xl md:text-4xl font-bold gradient-text">
                  {surah.name}
                </h1>
                <p className="font-arabic text-4xl md:text-5xl text-primary arabic-enhanced">
                  {surah.nameArabic}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="secondary">{surah.revelationPlace}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {surah.totalAyahs} Ayahs
                  </span>
                </div>
              </div>

              {/* Translation and Reciter Selectors */}
              <div className="pt-4 border-t space-y-6">
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* Translation Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Languages className="h-4 w-4" />
                      <span>Translation</span>
                    </div>
                    <Select value={selectedTranslator} onValueChange={setSelectedTranslator}>
                      <SelectTrigger data-testid="select-translator">
                        <SelectValue placeholder="Select translator" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">English</div>
                        {TRANSLATORS.filter(t => t.language === "en").map(translator => (
                          <SelectItem key={translator.value} value={translator.value}>
                            {translator.name}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">اردو (Urdu)</div>
                        {TRANSLATORS.filter(t => t.language === "ur").map(translator => (
                          <SelectItem key={translator.value} value={translator.value}>
                            {translator.name}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">हिन्दी (Hindi)</div>
                        {TRANSLATORS.filter(t => t.language === "hi").map(translator => (
                          <SelectItem key={translator.value} value={translator.value}>
                            {translator.name}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">العربية (Arabic Tafsir)</div>
                        {TRANSLATORS.filter(t => t.language === "ar").map(translator => (
                          <SelectItem key={translator.value} value={translator.value}>
                            {translator.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reciter Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Volume2 className="h-4 w-4" />
                      <span>Recitation</span>
                    </div>
                    <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                      <SelectTrigger data-testid="select-reciter">
                        <SelectValue placeholder="Select reciter" />
                      </SelectTrigger>
                      <SelectContent>
                        {reciters?.map(reciter => (
                          <SelectItem key={reciter.id} value={reciter.identifier}>
                            {reciter.name}
                            <span className="text-xs text-muted-foreground mr-2" dir="rtl">
                              {reciter.nameArabic}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ayahs List */}
          <div className="space-y-6">
            {ayahs.map((ayah, index) => (
              <Card 
                key={ayah.id} 
                data-testid={`card-ayah-${ayah.ayahNumber}`}
                className="card-elevate hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <Badge variant="outline" className="flex-shrink-0 font-semibold glow-primary-hover">
                      {ayah.ayahNumber}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handlePlayAudio(ayah)}
                        disabled={playingAyah === ayah.id}
                        data-testid={`button-play-${ayah.ayahNumber}`}
                        className={playingAyah === ayah.id ? "animate-pulse-subtle" : ""}
                      >
                        <Volume2 className={`h-4 w-4 ${playingAyah === ayah.id ? 'text-primary' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <p
                    className="font-arabic text-2xl md:text-3xl leading-loose text-right arabic-enhanced"
                    dir="rtl"
                  >
                    {ayah.textArabic}
                  </p>

                  <p 
                    className="text-muted-foreground leading-relaxed"
                    dir={currentTranslator?.language === "ur" || currentTranslator?.language === "ar" ? "rtl" : "ltr"}
                  >
                    {getTranslation(ayah.id)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <IslamicChatbot type="quran" />
    </div>
  );
}
