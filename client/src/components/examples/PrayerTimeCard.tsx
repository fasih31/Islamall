import { ThemeProvider } from "../ThemeProvider";
import { PrayerTimeCard } from "../PrayerTimeCard";

export default function PrayerTimeCardExample() {
  return (
    <ThemeProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-8 bg-background">
        <PrayerTimeCard name="Fajr" time="05:30" isNext={true} />
        <PrayerTimeCard name="Dhuhr" time="12:45" />
        <PrayerTimeCard name="Asr" time="16:15" />
        <PrayerTimeCard name="Maghrib" time="18:30" />
        <PrayerTimeCard name="Isha" time="20:00" />
      </div>
    </ThemeProvider>
  );
}
