import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import Home from "@/pages/Home";
import Quran from "@/pages/Quran";
import SurahDetail from "@/pages/SurahDetail";
import QuranRead from "@/pages/QuranRead";
import Hadith from "@/pages/Hadith";
import HadithValidator from "@/pages/HadithValidator";
import PrayerTimes from "@/pages/PrayerTimes";
import Finance from "@/pages/Finance";
import Books from "@/pages/Books";
import BookDetail from "@/pages/BookDetail";
import Community from "@/pages/Community";
import FinanceSection from "@/pages/FinanceSection";
import DailyLifeSection from "@/pages/DailyLifeSection";
import PoliticsSection from "@/pages/PoliticsSection";
import MedicineSection from "@/pages/MedicineSection";
import TopicDetail from "@/pages/TopicDetail";
import DuaPage from "@/pages/DuaPage";
import Search from "@/pages/Search";
import ZakatCalculator from "@/pages/ZakatCalculator";
import IslamicCalendar from "@/pages/IslamicCalendar";
import HabitTracker from "@/pages/HabitTracker";
import Dashboard from "@/pages/Dashboard";
import CultureBrotherhood from "@/pages/CultureBrotherhood";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quran" component={Quran} />
      <Route path="/quran/read/:id" component={QuranRead} />
      <Route path="/quran/:id" component={SurahDetail} />
      <Route path="/hadith" component={Hadith} />
      <Route path="/hadith/validate" component={HadithValidator} />
      <Route path="/prayer-times" component={PrayerTimes} />
      <Route path="/finance" component={FinanceSection} />
      <Route path="/daily-life" component={DailyLifeSection} />
      <Route path="/politics" component={PoliticsSection} />
      <Route path="/medicine" component={MedicineSection} />
      <Route path="/topics/:slug" component={TopicDetail} />
      <Route path="/books/:id" component={BookDetail} />
      <Route path="/books" component={Books} />
      <Route path="/duas" component={DuaPage} />
      <Route path="/search" component={Search} />
      <Route path="/zakat" component={ZakatCalculator} />
      <Route path="/calendar" component={IslamicCalendar} />
      <Route path="/habits" component={HabitTracker} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/community" component={Community} />
      <Route path="/culture" component={CultureBrotherhood} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider defaultLanguage="en">
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
