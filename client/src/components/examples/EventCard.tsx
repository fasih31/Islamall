import { ThemeProvider } from "../ThemeProvider";
import { EventCard } from "../EventCard";

export default function EventCardExample() {
  return (
    <ThemeProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-background">
        <EventCard
          title="Jummah Khutbah & Prayer"
          date="Friday, Oct 13, 2025 at 1:00 PM"
          location="Central Mosque, Downtown"
          organizer="Islamic Center"
          attendees={234}
        />
        <EventCard
          title="Quran Tafsir Session"
          date="Saturday, Oct 14, 2025 at 4:00 PM"
          location="Community Hall, West Side"
          organizer="Sheikh Ahmad"
          attendees={87}
        />
      </div>
    </ThemeProvider>
  );
}
