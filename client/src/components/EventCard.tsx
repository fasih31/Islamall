import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  organizer: string;
  attendees: number;
}

export function EventCard({ title, date, location, organizer, attendees }: EventCardProps) {
  return (
    <Card className="p-6 hover-elevate" data-testid="card-event">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2" data-testid="text-event-title">{title}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span data-testid="text-event-date">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span data-testid="text-event-location">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span data-testid="text-event-attendees">{attendees} attending</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-muted-foreground">by {organizer}</span>
          <Button size="sm" data-testid="button-rsvp">RSVP</Button>
        </div>
      </div>
    </Card>
  );
}
