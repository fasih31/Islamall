import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, Clock, Search, ChevronDown, Languages } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage, type Language } from "./LanguageProvider";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languageLabels: Record<Language, string> = {
    en: "English",
    ar: "عربي",
    ur: "اردو",
  };

  const learnLinks = [
    { href: "/quran", label: t("quran"), testId: "link-quran" },
    { href: "/hadith", label: t("hadith"), testId: "link-hadith" },
    { href: "/books", label: t("books"), testId: "link-books" },
    { href: "/topics", label: t("knowledge_hub"), testId: "link-topics" },
  ];

  const toolsLinks = [
    { href: "/prayer-times", label: t("prayer_times"), testId: "link-prayer-times" },
    { href: "/zakat", label: t("zakat"), testId: "link-zakat" },
    { href: "/calendar", label: t("calendar"), testId: "link-calendar" },
    { href: "/habits", label: t("habits"), testId: "link-habits" },
    { href: "/dua-recommendations", label: t("dua_recommendations"), testId: "link-dua-recommendations" },
    { href: "/duas", label: t("duas"), testId: "link-duas" },
  ];

  const communityLinks = [
    { href: "/community", label: t("events"), testId: "link-community" },
    { href: "/culture", label: t("culture_brotherhood"), testId: "link-culture" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="font-arabic text-lg font-bold">☪</span>
            </div>
            <span className="font-serif text-lg md:text-xl font-semibold">Islamic Compass</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {/* Learn Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto px-0 py-0 font-medium text-sm hover:text-primary" data-testid="dropdown-learn">
                  {t("learn")} <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {learnLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} data-testid={link.testId}>
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto px-0 py-0 font-medium text-sm hover:text-primary" data-testid="dropdown-tools">
                  {t("tools")} <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {toolsLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} data-testid={link.testId}>
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Community Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto px-0 py-0 font-medium text-sm hover:text-primary" data-testid="dropdown-community">
                  {t("community")} <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {communityLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} data-testid={link.testId}>
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
              data-testid="link-dashboard"
            >
              {t("dashboard")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span data-testid="text-next-prayer">Fajr in 2h 34m</span>
          </div>

          <Link href="/search">
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-language-toggle">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(languageLabels) as Language[]).map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={language === lang ? "bg-accent" : ""}
                  data-testid={`lang-${lang}`}
                >
                  {languageLabels[lang]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6 mt-6">
                {/* Learn Section */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t("learn")}</h3>
                  <div className="flex flex-col gap-2">
                    {learnLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-base font-medium transition-colors hover:text-primary py-1"
                        data-testid={`mobile-${link.testId}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tools Section */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t("tools")}</h3>
                  <div className="flex flex-col gap-2">
                    {toolsLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-base font-medium transition-colors hover:text-primary py-1"
                        data-testid={`mobile-${link.testId}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Community Section */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t("community")}</h3>
                  <div className="flex flex-col gap-2">
                    {communityLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-base font-medium transition-colors hover:text-primary py-1"
                        data-testid={`mobile-${link.testId}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  className="text-base font-medium transition-colors hover:text-primary py-1"
                  data-testid="mobile-link-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("dashboard")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
