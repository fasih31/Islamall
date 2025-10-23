import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface PrayerTimeCardProps {
  name: string;
  time: string;
  isNext?: boolean;
}

export function PrayerTimeCard({ name, time, isNext }: PrayerTimeCardProps) {
  return (
    <Card
      className={`p-6 ${isNext ? "border-primary border-2" : ""}`}
      data-testid={`card-prayer-${name.toLowerCase()}`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <Clock className={`h-8 w-8 ${isNext ? "text-primary" : "text-muted-foreground"}`} />
        <div className="space-y-1">
          <h3 className={`font-semibold text-lg ${isNext ? "text-primary" : ""}`}>{name}</h3>
          <p className="text-2xl font-mono font-semibold" data-testid={`text-time-${name.toLowerCase()}`}>
            {time}
          </p>
        </div>
        {isNext && (
          <span className="text-xs text-primary font-medium" data-testid="badge-next-prayer">
            Next Prayer
          </span>
        )}
      </div>
    </Card>
  );
}
