import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";

interface CalendarDay {
  gregorianDate: Date;
  hijriDay: number;
  hijriMonth: string;
  hijriYear: number;
  isToday: boolean;
  isCurrentMonth: boolean;
}

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhul-Qa'dah", "Dhul-Hijjah"
];

export default function IslamicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Accurate Hijri conversion using Kuwaiti algorithm
  const gregorianToHijri = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let a, b;
    
    if (month < 3) {
      a = year - 1;
      b = month + 12;
    } else {
      a = year;
      b = month;
    }
    
    const jd = Math.floor(365.25 * (a + 4716)) + Math.floor(30.6001 * (b + 1)) + day - 1524;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l1 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) + Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
    const l2 = l1 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const hijriMonth = Math.floor((24 * l2) / 709);
    const hijriDay = l2 - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;
    
    return {
      day: hijriDay,
      month: HIJRI_MONTHS[hijriMonth - 1] || HIJRI_MONTHS[0],
      year: hijriYear
    };
  };

  const today = new Date();
  const hijriToday = gregorianToHijri(today);

  // Generate calendar days for current month
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    // Add previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      const hijri = gregorianToHijri(date);
      days.push({
        gregorianDate: date,
        hijriDay: hijri.day,
        hijriMonth: hijri.month,
        hijriYear: hijri.year,
        isToday: false,
        isCurrentMonth: false
      });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hijri = gregorianToHijri(date);
      const isToday = date.toDateString() === today.toDateString();
      
      days.push({
        gregorianDate: date,
        hijriDay: hijri.day,
        hijriMonth: hijri.month,
        hijriYear: hijri.year,
        isToday,
        isCurrentMonth: true
      });
    }

    // Add next month's days to fill grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const hijri = gregorianToHijri(date);
      days.push({
        gregorianDate: date,
        hijriDay: hijri.day,
        hijriMonth: hijri.month,
        hijriYear: hijri.year,
        isToday: false,
        isCurrentMonth: false
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Islamic Calendar
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View Hijri and Gregorian dates side by side. Plan your Islamic observances and daily routines.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Today's Date Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Today's Date</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Hijri</span>
                  </div>
                  <p className="text-2xl font-bold font-arabic" dir="rtl" data-testid="hijri-today">
                    {hijriToday.day} {hijriToday.month} {hijriToday.year} هـ
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Gregorian</span>
                  </div>
                  <p className="text-xl font-semibold" data-testid="gregorian-today">
                    {today.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={goToToday}
                      data-testid="button-today"
                    >
                      Today
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={goToPreviousMonth}
                      data-testid="button-prev-month"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={goToNextMonth}
                      data-testid="button-next-month"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        p-3 rounded-md border text-center space-y-1 hover-elevate cursor-pointer
                        ${day.isToday ? 'bg-primary text-primary-foreground border-primary' : ''}
                        ${!day.isCurrentMonth ? 'opacity-40' : ''}
                      `}
                      data-testid={day.isToday ? "calendar-today" : undefined}
                    >
                      <div className={`text-sm font-medium ${day.isToday ? 'text-primary-foreground' : ''}`}>
                        {day.gregorianDate.getDate()}
                      </div>
                      <div className={`text-xs font-arabic ${day.isToday ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {day.hijriDay}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Islamic Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Important Islamic Dates (Sample)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <Moon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Ramadan 1446 AH</h4>
                    <p className="text-sm text-muted-foreground">Expected: March 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <Moon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Eid al-Fitr 1446 AH</h4>
                    <p className="text-sm text-muted-foreground">Expected: April 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <Moon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Hajj / Eid al-Adha</h4>
                    <p className="text-sm text-muted-foreground">Expected: June 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <Moon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Muharram 1447 AH</h4>
                    <p className="text-sm text-muted-foreground">Expected: July 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
