import { ThemeProvider } from "../ThemeProvider";
import { StatCard } from "../StatCard";
import { BookOpen, FileText, Users } from "lucide-react";

export default function StatCardExample() {
  return (
    <ThemeProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-background">
        <StatCard label="Quranic Verses" value="6,236" icon={BookOpen} />
        <StatCard label="Authentic Hadith" value="7,563" icon={FileText} />
        <StatCard label="Community Members" value="150K+" icon={Users} />
      </div>
    </ThemeProvider>
  );
}
