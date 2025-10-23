import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Copy, Volume2 } from "lucide-react";
import { useState } from "react";

interface VerseCardProps {
  surahName: string;
  verseNumber: number;
  arabicText: string;
  translation: string;
}

export function VerseCard({ surahName, verseNumber, arabicText, translation }: VerseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <Card className="p-8" data-testid={`card-verse-${verseNumber}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {surahName} - Verse {verseNumber}
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-arabic text-3xl leading-loose text-right" dir="rtl">
            {arabicText}
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {translation}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsBookmarked(!isBookmarked);
              console.log("Bookmark toggled");
            }}
            data-testid="button-bookmark"
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Play audio")}
            data-testid="button-play-audio"
          >
            <Volume2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Copy verse")}
            data-testid="button-copy"
          >
            <Copy className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("Share verse")}
            data-testid="button-share"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
