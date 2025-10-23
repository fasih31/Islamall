import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HadithCardProps {
  book: string;
  chapter: string;
  arabicText: string;
  translation: string;
  grade: "Sahih" | "Hasan" | "Daif";
  narrator: string;
}

export function HadithCard({ book, chapter, arabicText, translation, grade, narrator }: HadithCardProps) {
  const gradeColors = {
    Sahih: "bg-chart-2 text-white",
    Hasan: "bg-chart-3 text-white",
    Daif: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="p-6 hover-elevate" data-testid="card-hadith">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" data-testid="badge-book">{book}</Badge>
          <Badge variant="secondary" data-testid="badge-chapter">{chapter}</Badge>
          <Badge className={gradeColors[grade]} data-testid="badge-grade">{grade}</Badge>
        </div>

        <div className="space-y-3">
          <p className="font-arabic text-xl leading-loose text-right" dir="rtl">
            {arabicText}
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            {translation}
          </p>
        </div>

        <div className="text-sm text-muted-foreground pt-2 border-t">
          Narrated by: {narrator}
        </div>
      </div>
    </Card>
  );
}
