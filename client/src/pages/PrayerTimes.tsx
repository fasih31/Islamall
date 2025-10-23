import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Sun, Sunrise, Sunset, Moon } from "lucide-react";

interface PrayerTime {
  location: string;
  date: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const prayerIcons = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

export default function PrayerTimesPage() {
  const [location, setLocation] = useState("Loading...");
  const [lat, setLat] = useState("40.7128");
  const [lon, setLon] = useState("-74.0060");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { data: prayerTimes, isLoading } = useQuery<PrayerTime>({
    queryKey: ["/api/prayer-times", location, lat, lon],
    queryFn: async () => {
      const params = new URLSearchParams({ location, lat, lon });
      const res = await fetch(`/api/prayer-times?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return await res.json();
    },
    enabled: location !== "Loading...",
  });

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude.toFixed(6));
          setLon(longitude.toFixed(6));
          
          // Reverse geocode to get location name
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'User-Agent': 'IslamicCompassPortal/1.0' } }
            );
            if (res.ok) {
              const data = await res.json();
              const locationName = data.address.city || 
                                 data.address.town || 
                                 data.address.village || 
                                 data.address.county ||
                                 data.address.state ||
                                 "Your Location";
              setLocation(locationName);
            } else {
              setLocation("Your Location");
            }
          } catch (error) {
            console.error("Geocoding error:", error);
            setLocation("Your Location");
          }
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Set default to Mecca
          setLat("21.4225");
          setLon("39.8262");
          setLocation("Mecca");
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Default to Mecca if geolocation not supported
      setLat("21.4225");
      setLon("39.8262");
      setLocation("Mecca");
      setIsGettingLocation(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const prayers = prayerTimes
    ? [
        { name: "Fajr", time: prayerTimes.fajr },
        { name: "Dhuhr", time: prayerTimes.dhuhr },
        { name: "Asr", time: prayerTimes.asr },
        { name: "Maghrib", time: prayerTimes.maghrib },
        { name: "Isha", time: prayerTimes.isha },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Prayer Times
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Never miss a prayer with accurate prayer times for your location.
              Stay connected with your spiritual practice.
            </p>
          </div>

          {/* Location Input */}
          <Card>
            <CardHeader>
              <CardTitle>Your Location</CardTitle>
              <CardDescription>
                Enter your city or location to get accurate prayer times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your location..."
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    data-testid="input-location"
                  />
                </div>
                <Button 
                  onClick={getCurrentLocation} 
                  disabled={isGettingLocation}
                  data-testid="button-get-times"
                >
                  {isGettingLocation ? "Getting Location..." : "Use My Location"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Times Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prayers.map((prayer) => {
                const Icon = prayerIcons[prayer.name as keyof typeof prayerIcons];
                return (
                  <Card key={prayer.name} data-testid={`card-prayer-${prayer.name.toLowerCase()}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{prayer.name}</CardTitle>
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold font-mono">{prayer.time}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Info Card */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Prayer Time Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Prayer times are calculated based on astronomical data and your
                geographic location. These times may vary slightly from your
                local mosque announcements.
              </p>
              <p>
                For the most accurate times, please verify with your local Islamic
                center or mosque.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
