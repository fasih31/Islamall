import { ThemeProvider } from "../ThemeProvider";
import { Footer } from "../Footer";

export default function FooterExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <Footer />
      </div>
    </ThemeProvider>
  );
}
