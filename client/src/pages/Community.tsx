import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Users, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  description?: string;
  attendees: number;
  verified: boolean;
}

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  organizer: z.string().min(2, "Organizer name must be at least 2 characters"),
  description: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function CommunityPage() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      organizer: "",
      description: "",
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (values: EventFormValues) => {
      return await apiRequest("POST", "/api/events", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event created successfully!",
        description: "Your event has been added to the community calendar.",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      // Check if unauthorized - error message format is "401: Unauthorized"
      if (error.message?.startsWith("401:") || error.message?.includes("Unauthorized")) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to create events. Redirecting to login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Failed to create event",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      return await apiRequest("POST", `/api/events/${eventId}/rsvp`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "RSVP successful!",
        description: "You're registered for this event.",
      });
    },
    onError: (error: any) => {
      // Check if unauthorized - error message format is "401: Unauthorized"
      if (error.message?.startsWith("401:") || error.message?.includes("Unauthorized")) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to RSVP. Redirecting to login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "RSVP failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: EventFormValues) => {
    createEventMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold">
                  Community Events
                </h1>
                <p className="text-muted-foreground mt-2">
                  Connect with your local Muslim community. Join events, lectures,
                  and gatherings near you.
                </p>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-event">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Add a new community event to the calendar.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Jummah Prayer" {...field} data-testid="input-event-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date & Time</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} data-testid="input-event-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Islamic Center of Example City" {...field} data-testid="input-event-location" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="organizer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organizer</FormLabel>
                            <FormControl>
                              <Input placeholder="Islamic Center" {...field} data-testid="input-event-organizer" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Event details..." 
                                {...field} 
                                data-testid="input-event-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                          data-testid="button-cancel-event"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createEventMutation.isPending}
                          data-testid="button-submit-event"
                        >
                          {createEventMutation.isPending ? "Creating..." : "Create Event"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events?.map((event) => (
                <Card
                  key={event.id}
                  className="hover-elevate active-elevate-2"
                  data-testid={`card-event-${event.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">
                        {event.title}
                      </CardTitle>
                      {event.verified && (
                        <Badge variant="secondary" className="flex-shrink-0">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Organized by {event.organizer}
                    </p>
                    <Button
                      onClick={() => rsvpMutation.mutate({ eventId: event.id, status: "attending" })}
                      disabled={rsvpMutation.isPending}
                      className="w-full"
                      data-testid={`button-rsvp-${event.id}`}
                    >
                      {rsvpMutation.isPending ? "RSVPing..." : "RSVP to Event"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {events?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          )}

          {/* Info Card */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Join Our Community
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Want to organize an event or gathering? Contact your local Islamic
                center or reach out to us to list your event here. Together, we can
                build a stronger, more connected Muslim community.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
