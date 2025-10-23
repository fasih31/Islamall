import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2 } from "lucide-react";

interface TafsirDisplayProps {
  ayahId: string;
  surahNumber: number;
  ayahNumber: number;
}

export function TafsirDisplay({ ayahId, surahNumber, ayahNumber }: TafsirDisplayProps) {
  const { data: tafsirList, isLoading } = useQuery<any[]>({
    queryKey: [`/api/tafsir/${ayahId}`],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!tafsirList || tafsirList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Tafsir (Commentary)</CardTitle>
          </div>
          <CardDescription>
            Scholarly explanation for Surah {surahNumber}, Ayah {ayahNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tafsir for this ayah will be available soon, Insha'Allah. 
            We are working on adding authentic scholarly commentary from renowned mufassireen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="tafsir-display">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Tafsir (Commentary)</CardTitle>
        </div>
        <CardDescription>
          Scholarly explanation for Surah {surahNumber}, Ayah {ayahNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {tafsirList.map((tafsir: any, index: number) => (
          <div key={tafsir.id} className="space-y-3">
            {index > 0 && <Separator />}
            <div className="flex items-center gap-2">
              <Badge variant="outline" data-testid={`tafsir-scholar-${index}`}>
                {tafsir.scholarName}
              </Badge>
              <Badge variant="secondary">{tafsir.source}</Badge>
            </div>
            <p className="text-sm leading-relaxed" data-testid={`tafsir-text-${index}`}>
              {tafsir.commentary}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
