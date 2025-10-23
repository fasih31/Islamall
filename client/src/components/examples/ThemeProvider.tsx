import { ThemeProvider } from "../ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      data-testid="button-theme-toggle"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="flex items-center justify-center gap-4 p-8 bg-background">
        <p className="text-foreground">Current theme:</p>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
