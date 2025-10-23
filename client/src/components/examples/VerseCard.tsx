import { ThemeProvider } from "../ThemeProvider";
import { VerseCard } from "../VerseCard";

export default function VerseCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background max-w-4xl mx-auto">
        <VerseCard
          surahName="Al-Fatihah"
          verseNumber={1}
          arabicText="بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ"
          translation="In the name of Allah, the Most Gracious, the Most Merciful."
        />
      </div>
    </ThemeProvider>
  );
}
