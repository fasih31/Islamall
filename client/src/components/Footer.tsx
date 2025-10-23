import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold">Islamic Compass</h3>
            <p className="text-sm text-muted-foreground">
              Your comprehensive guide to Islamic knowledge and practice.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/quran" className="text-muted-foreground hover:text-primary transition-colors">Quran</Link>
              <Link href="/hadith" className="text-muted-foreground hover:text-primary transition-colors">Hadith</Link>
              <Link href="/books" className="text-muted-foreground hover:text-primary transition-colors">Islamic Library</Link>
              <Link href="/prayer-times" className="text-muted-foreground hover:text-primary transition-colors">Prayer Times</Link>
              <Link href="/calendar" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-calendar">Islamic Calendar</Link>
              <Link href="/habits" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-habits">Habit Tracker</Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Knowledge Hub</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/finance" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-finance">Islamic Finance</Link>
              <Link href="/daily-life" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-daily-life">Daily Life</Link>
              <Link href="/politics" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-politics">Politics & Governance</Link>
              <Link href="/medicine" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-medicine">Prophetic Medicine</Link>
              <Link href="/duas" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-duas">Duas & Supplications</Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 Islamic Compass. All rights reserved.</p>
          <p className="mt-2">Developed by <span className="font-semibold text-foreground">Fasih ur Rehman</span></p>
        </div>
      </div>
    </footer>
  );
}
