import { ThemeProvider } from "../ThemeProvider";
import { QuickAccessCard } from "../QuickAccessCard";
import { BookOpen, FileText, Clock, DollarSign } from "lucide-react";

export default function QuickAccessCardExample() {
  return (
    <ThemeProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-background">
        <QuickAccessCard
          title="Quran"
          description="Read and explore the Holy Quran"
          icon={BookOpen}
          onClick={() => console.log("Navigate to Quran")}
        />
        <QuickAccessCard
          title="Hadith"
          description="Browse authentic Hadith collections"
          icon={FileText}
          onClick={() => console.log("Navigate to Hadith")}
        />
        <QuickAccessCard
          title="Prayer Times"
          description="Track daily prayer schedules"
          icon={Clock}
          onClick={() => console.log("Navigate to Prayer Times")}
        />
        <QuickAccessCard
          title="Finance"
          description="Islamic finance guidance & tools"
          icon={DollarSign}
          onClick={() => console.log("Navigate to Finance")}
        />
      </div>
    </ThemeProvider>
  );
}
