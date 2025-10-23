import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, TrendingUp, Calendar, Flame } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  category: "worship" | "character" | "knowledge" | "charity";
}

interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

const SUNNAH_HABITS: Habit[] = [
  {
    id: "five-prayers",
    name: "Five Daily Prayers",
    nameArabic: "الصلوات الخمس",
    description: "Establish the five obligatory prayers on time",
    category: "worship"
  },
  {
    id: "morning-adhkar",
    name: "Morning Adhkar",
    nameArabic: "أذكار الصباح",
    description: "Recite morning remembrances after Fajr",
    category: "worship"
  },
  {
    id: "evening-adhkar",
    name: "Evening Adhkar",
    nameArabic: "أذكار المساء",
    description: "Recite evening remembrances after Asr",
    category: "worship"
  },
  {
    id: "quran-recitation",
    name: "Quran Recitation",
    nameArabic: "تلاوة القرآن",
    description: "Read and reflect upon the Quran daily",
    category: "worship"
  },
  {
    id: "tahajjud",
    name: "Tahajjud Prayer",
    nameArabic: "صلاة التهجد",
    description: "Perform voluntary night prayer",
    category: "worship"
  },
  {
    id: "duha-prayer",
    name: "Duha Prayer",
    nameArabic: "صلاة الضحى",
    description: "Perform forenoon prayer (2-12 rakah)",
    category: "worship"
  },
  {
    id: "good-character",
    name: "Practice Good Character",
    nameArabic: "حسن الخلق",
    description: "Be kind, patient, and grateful",
    category: "character"
  },
  {
    id: "seek-knowledge",
    name: "Seek Knowledge",
    nameArabic: "طلب العلم",
    description: "Learn about Islam daily",
    category: "knowledge"
  },
  {
    id: "charity",
    name: "Give Charity",
    nameArabic: "الصدقة",
    description: "Give Sadaqah, even if small",
    category: "charity"
  },
  {
    id: "family-ties",
    name: "Maintain Family Ties",
    nameArabic: "صلة الرحم",
    description: "Connect with family members",
    category: "character"
  }
];

export default function HabitTracker() {
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const today = new Date().toISOString().split('T')[0];

  // Load habit logs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sunnah-habit-logs");
    if (saved) {
      try {
        setHabitLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load habit logs:", e);
      }
    }
  }, []);

  // Save habit logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("sunnah-habit-logs", JSON.stringify(habitLogs));
  }, [habitLogs]);

  const toggleHabit = (habitId: string) => {
    const existingLog = habitLogs.find(
      log => log.habitId === habitId && log.date === today
    );

    if (existingLog) {
      // Toggle existing log
      setHabitLogs(logs =>
        logs.map(log =>
          log.habitId === habitId && log.date === today
            ? { ...log, completed: !log.completed }
            : log
        )
      );
    } else {
      // Create new log
      setHabitLogs(logs => [
        ...logs,
        { habitId, date: today, completed: true }
      ]);
    }
  };

  const isHabitCompletedToday = (habitId: string): boolean => {
    const log = habitLogs.find(
      log => log.habitId === habitId && log.date === today
    );
    return log?.completed || false;
  };

  const getStreak = (habitId: string): number => {
    let streak = 0;
    const logs = habitLogs
      .filter(log => log.habitId === habitId && log.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (logs.length === 0) return 0;

    const todayDate = new Date(today);
    let currentDate = new Date(logs[0].date);

    // Check if most recent completion is today or yesterday
    const daysDiff = Math.floor((todayDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 1) return 0;

    for (const log of logs) {
      const logDate = new Date(log.date);
      const diff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 0 || diff === 1) {
        streak++;
        currentDate = logDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const todayProgress = SUNNAH_HABITS.filter(h => isHabitCompletedToday(h.id)).length;
  const todayPercentage = Math.round((todayProgress / SUNNAH_HABITS.length) * 100);

  const categoryColors = {
    worship: "bg-primary/10 text-primary",
    character: "bg-green-500/10 text-green-600 dark:text-green-500",
    knowledge: "bg-blue-500/10 text-blue-600 dark:text-blue-500",
    charity: "bg-amber-500/10 text-amber-600 dark:text-amber-500"
  };

  const groupedHabits = SUNNAH_HABITS.reduce((acc, habit) => {
    if (!acc[habit.category]) acc[habit.category] = [];
    acc[habit.category].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Sunnah Habit Tracker
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your daily Islamic practices and build consistency. Small daily actions lead to great rewards.
            </p>
          </div>

          {/* Today's Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Progress
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="today-progress">
                      {todayProgress} / {SUNNAH_HABITS.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Habits Completed</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2" data-testid="today-percentage">
                  {todayPercentage}%
                </Badge>
              </div>
              <Progress value={todayPercentage} className="h-3" data-testid="progress-bar" />
            </CardContent>
          </Card>

          {/* Habits by Category */}
          <div className="space-y-6">
            {Object.entries(groupedHabits).map(([category, habits]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize flex items-center gap-2">
                    {category === "worship" && <Circle className="h-5 w-5 text-primary" />}
                    {category === "character" && <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />}
                    {category === "knowledge" && <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-500" />}
                    {category === "charity" && <Flame className="h-5 w-5 text-amber-600 dark:text-amber-500" />}
                    {category.replace('-', ' ')} Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {habits.map(habit => {
                      const completed = isHabitCompletedToday(habit.id);
                      const streak = getStreak(habit.id);

                      return (
                        <div
                          key={habit.id}
                          className={`
                            flex items-center gap-4 p-4 rounded-lg border hover-elevate
                            ${completed ? 'bg-primary/5 border-primary/20' : ''}
                          `}
                          data-testid={`habit-${habit.id}`}
                        >
                          <Checkbox
                            checked={completed}
                            onCheckedChange={() => toggleHabit(habit.id)}
                            className="h-5 w-5 cursor-pointer"
                            data-testid={`checkbox-${habit.id}`}
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-semibold ${completed ? 'text-primary' : ''}`}>
                                {habit.name}
                              </h4>
                              {streak > 0 && (
                                <Badge variant="outline" className="flex items-center gap-1" data-testid={`streak-${habit.id}`}>
                                  <Flame className="h-3 w-3" />
                                  {streak} day{streak !== 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-arabic text-muted-foreground">
                              {habit.nameArabic}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {habit.description}
                            </p>
                          </div>
                          <Badge variant="outline" className={categoryColors[habit.category]}>
                            {category}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Encouragement */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="font-arabic text-2xl text-primary" dir="rtl">
                  إِنَّ مَعَ الْعُسْرِ يُسْرًا
                </p>
                <p className="text-sm text-muted-foreground">
                  "Verily, with hardship comes ease." - Quran 94:6
                </p>
                <p className="text-sm">
                  The most beloved deeds to Allah are those done consistently, even if they are small.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
