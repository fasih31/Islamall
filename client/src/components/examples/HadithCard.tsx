import { ThemeProvider } from "../ThemeProvider";
import { HadithCard } from "../HadithCard";

export default function HadithCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background max-w-3xl mx-auto space-y-4">
        <HadithCard
          book="Sahih Bukhari"
          chapter="Book of Faith"
          arabicText="إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ"
          translation="Actions are according to intentions, and everyone will get what was intended."
          grade="Sahih"
          narrator="Umar ibn Al-Khattab"
        />
      </div>
    </ThemeProvider>
  );
}
